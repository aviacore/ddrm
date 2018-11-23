const DDRMCore = artifacts.require('DDRMCore');
const ERC20Example = artifacts.require('ERC20Example');

module.exports = function(deployer) {
  deployer.deploy(ERC20Example).then(function() {
    return deployer.deploy(DDRMCore, ERC20Example.address);
  });
};
