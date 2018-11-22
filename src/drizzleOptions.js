import Core from './../build/contracts/Core.json';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [Core, IERC20],
  events: {
    SimpleStorage: ['StorageSet']
  },
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions;
