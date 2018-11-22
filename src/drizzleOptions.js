import Core from './../build/contracts/Core.json';
import ERC20Token from './../build/contracts/ERC20Token.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [Core, ERC20Token],
  // events: {
  //   SimpleStorage: ['StorageSet']
  // },
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions;
