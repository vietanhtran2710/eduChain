import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const Web3 = require('web3')

const baseUrl = 'http://localhost:8080/api/blockchain';

const unpack = (str: string) => {
  var bytes = [];
  for(var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      bytes.push(char >>> 8);
      bytes.push(char & 0xFF);
  }
  return bytes;
}

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private web3: any;
  private initialized = false;

  private contestFactoryArtifacts = require('../../../build/contracts/ContestFactory.json');
  private contestFactory = this.contestFactoryArtifacts.abi;
  private contestFactoryAddress = this.contestFactoryArtifacts.networks["5777"].address;
  private contestFactoryContract: any;

  private certificateArtifacts = require('../../../build/contracts/Certificate.json');
  private certificate = this.certificateArtifacts.abi;
  private certificateAddress = this.certificateArtifacts.networks["5777"].address;
  private certificateContract: any;

  private rewardArtifacts = require('../../../build/contracts/LearningReward.json');
  private reward = this.rewardArtifacts.abi;
  private rewardAddress = this.rewardArtifacts.networks["5777"].address
  private rewardContract: any;

  private singleContestArtifacts = require('../../../build/contracts/Contest.json');
  private singleContest = this.singleContestArtifacts.abi;
  private singleContestContract: any;

  constructor(private http: HttpClient) {

  }

  async initWeb3() {
    this.web3 = new Web3(Web3.givenProvider || '"ws://localhost:7545"');
    this.contestFactoryContract = await new this.web3.eth.Contract(this.contestFactory, this.contestFactoryAddress);
    this.rewardContract = await new this.web3.eth.Contract(this.reward, this.rewardAddress);
    this.certificateContract = await new this.web3.eth.Contract(this.certificate, this.certificateAddress);
    this.initialized = true;
  }

  mintVND(data: any) {
    return this.http.post(`${baseUrl}/buy`, data)
  }

  burnVND(data: any) {
    return this.http.post(`${baseUrl}/sell`, data)
  }

  async approve(currentAccount: string, amount: number) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.setApprovalForAll("0x94eF6f0f7193C0cD3DAD6f7Fee15e82e1B02d614", true).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async revokeCertificate(hash: string, reason: string, currentAccount: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.certificateContract.methods.hashToID(hash).call()
      .then((id: number) => {
        that.certificateContract.methods.revokeCertificate([id], reason).send({from: currentAccount})
        .then((result: any) => {
          return resolve(result);
        })
      })
    })
  }

  async revokedStatus(hash: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.certificateContract.methods.hashToID(hash).call()
      .then((id: number) => {
        that.certificateContract.methods.revokedStatus(id).call()
        .then((status: any) => {
          return resolve(status);
        })
      })
    })
  }

  async getEthBalance(address: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getBalance(address)
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async isSponsoring(address: string, contractAddress: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.isApprovedForAll(address, contractAddress).call()
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async approveForContract(contractaddress: string, currentAccount: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.approveForContract(contractaddress).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async register(studentsList: Array<string>, contestAddress: string, currentAccount: string) {
    await this.initWeb3();
    this.singleContestContract = await new this.web3.eth.Contract(this.singleContest, contestAddress);
    const that = this;
    return new Promise((resolve, reject) => {
      that.singleContestContract.methods.registerBatch(studentsList).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async endContest(contestAddress: string, currentAccount: string) {
    await this.initWeb3();
    this.singleContestContract = await new this.web3.eth.Contract(this.singleContest, contestAddress);
    const that = this;
    return new Promise((resolve, reject) => {
      that.singleContestContract.methods.endContest().send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async registerReward(contestAddress: string, amount: number, nft: Array<number>, currentAccount: string) {
    await this.initWeb3();
    this.singleContestContract = await new this.web3.eth.Contract(this.singleContest, contestAddress);
    const that = this;
    return new Promise((resolve, reject) => {
      that.singleContestContract.methods.registerReward(amount, nft).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async submitAnswer(contestAddress: string, studentAddress: string, answer: string, time: number) {
    await this.initWeb3();
    this.singleContestContract = await new this.web3.eth.Contract(this.singleContest, contestAddress);
    const that = this;
    return new Promise((resolve, reject) => {
      that.singleContestContract.methods.gradeSubmission(studentAddress, unpack(answer), time).send({from: studentAddress})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async getContestResult(contestAddress: string) {
    type Result = {
      address: string,
      grade: number,
      time: number
    }
    await this.initWeb3();
    let results: Array<Result> = [];
    this.singleContestContract = await new this.web3.eth.Contract(this.singleContest, contestAddress);
    const that = this;
    return new Promise((resolve, reject) => {
      that.singleContestContract.methods.getStudents().call()
      .then((result: any) => {
        for (let item of result) {
          let instance: Result = {address: item, grade: 0, time: 0}; 
          results.push(instance);
        }
        that.singleContestContract.methods.getStudentResults().call()
        .then((result: any) => {
          for (let i = 0; i < result.length; i++) {
            results[i].grade = result[i].grade;
            results[i].time = result[i].time;
          }
          return resolve(results);
        })
      })
    })
  }

  async createNFT(address: string, uri: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.createNFT(address, uri).send({from: address})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async getSkillBalance(address: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.balanceOf(address, 0).call()
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async getOwnedNFTs(address: string) {
    if (!this.initialized) await this.initWeb3();
    type NFTInfo = {
      tokenId?: number;
      uri?: string;
    };
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.getOwnedNFTs(address).call()
      .then((result: any) => {
        let nftInfos: Array<NFTInfo> = [];
        for (let item of result) {
          nftInfos.push({tokenId: item, uri: ""})
        }
        let promises = [];
        for (let item of result) {
          promises.push(that.rewardContract.methods.uri(item).call());
        }
        Promise.all(promises).then((values) => {
          for (let i = 0; i < values.length; i++) {
            nftInfos[i].uri = values[i];
          }
          return resolve(nftInfos);
        })
      })
    })
  }

  async getVNDBalance(address: string) {
    if (!this.initialized) await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.balanceOf(address, 1).call()
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async createReward(address: string, required: number, amount: number, currentAccount: string) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.createStudyProgressReward(address, amount, required).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async getAllRewards(address: string) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.rewardContract.methods.getAllRewards(address).call()
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  getContestFactoryAddress(): string {
    return this.contestFactoryAddress
  }

  getRewardAddress(): string {
    return this.rewardAddress
  }

  async createContest(answer: string, currentAccount: string) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contestFactoryContract.methods.createNewContest(unpack(answer)).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async getAllContestRewards(contestAddress: string) {
    await this.initWeb3();
    this.singleContestContract = await new this.web3.eth.Contract(this.singleContest, contestAddress);
    const that = this;
    return new Promise((resolve, reject) => {
      that.singleContestContract.methods.getAllRewardOf().call()
      .then((result: any) => {
        return resolve(result);
      })
    })
  }
}
