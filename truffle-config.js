require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

const infuraProvider = network =>
  new HDWalletProvider(
    process.env.MNEMONIC || '',
    `https://${network}.infura.io/${process.env.INFURA_API_KEY}`
  );

module.exports = {
  networks: {
    live: {
      provider: infuraProvider('kovan'),
      network_id: '42'
    },
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    main: {
      provider: infuraProvider('mainnet'),
      network_id: '1'
    },
    ropsten: {
      provider: infuraProvider('ropsten'),
      network_id: '3'
    },
    rinkeby: {
      provider: infuraProvider('rinkeby'),
      network_id: '4'
    },
    kovan: {
      provider: infuraProvider('kovan'),
      network_id: '42'
    },
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*'
    },
    ganachecli: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    }
  }
};
