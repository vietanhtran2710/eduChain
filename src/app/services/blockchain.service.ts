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
  private contestFactoryAddress = this.contestFactoryArtifacts.networks["5777"].address

  private rewardArtifacts = require('../../../build/contracts/LearningReward.json');
  private reward = this.rewardArtifacts.abi;
  private rewardAddress = this.rewardArtifacts.networks["5777"].address

  constructor() {

  }

  async initWeb3() {
    this.web3 = new Web3(Web3.givenProvider || '"ws://localhost:7545"');
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

  getContestFactoryAddress(): string {
    return this.contestFactoryAddress
  }

  getRewardAddress(): string {
    return this.rewardAddress
  }
}
