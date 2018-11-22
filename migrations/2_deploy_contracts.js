const ERC20Token = artifacts.require('ERC20Token');
const Core = artifacts.require('Core');

module.exports = function(deployer) {
  deployer.deploy(ERC20Token).then(function() {
    return deployer.deploy(Core, ERC20Token.address);
  });
};
