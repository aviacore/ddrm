import DDRMCore from './../build/contracts/DDRMCore.json';
import ERC20Example from './../build/contracts/ERC20Example.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [DDRMCore, ERC20Example],
  // events: {
  //   SimpleStorage: ['StorageSet']
  // },
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions;
