import { Injectable } from '@angular/core';
const Web3 = require('web3')

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

  private rewardArtifacts = require('../../../build/contracts/LearningReward.json');
  private reward = this.rewardArtifacts.abi;
  private rewardAddress = this.rewardArtifacts.networks["5777"].address
  private rewardContract: any;

  constructor() {

  }

  async initWeb3() {
    this.web3 = new Web3(Web3.givenProvider || '"ws://localhost:7545"');
    this.contestFactoryContract = await new this.web3.eth.Contract(this.contestFactory, this.contestFactoryAddress);
    this.rewardContract = await new this.web3.eth.Contract(this.reward, this.rewardAddress);
    this.initialized = true;
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

  getContestFactoryAddress(): string {
    return this.contestFactoryAddress
  }

  getRewardAddress(): string {
    return this.rewardAddress
  }
}
