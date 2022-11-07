import { Injectable } from '@angular/core';
const Web3 = require('web3')

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  private web3: any;
  private rewardArtifacts = require('../../../build/contracts/LearningReward.json');
  private rewardContractABI = this.rewardArtifacts.abi;
  private rewardContractAddress = this.rewardArtifacts.networks["5777"].address
  private rewardContract: any;
  private initialized = false;

  constructor() { 
    this.initWeb3();
  }

  async initWeb3() {
    this.web3 = new Web3(Web3.givenProvider || '"ws://localhost:7545"');
    this.rewardContract = await new this.web3.eth.Contract(this.rewardContractABI, this.rewardContractAddress);
    this.initialized = true;
  }

  grantRole(address: string, role: string, currentAccount: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (role == "SPONSOR") {
        that.rewardContract.methods.addSponsor(address).send({from: currentAccount})
        .then((result: any) => {
          return resolve(result);
        })
      }
      else if (role == "TEACHER") {
        that.rewardContract.methods.addTeacher(address).send({from: currentAccount})
        .then((result: any) => {
          return resolve(result);
        })
      }
      
    })
  }
}
