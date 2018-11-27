const DDRMCore = artifacts.require('DDRMCore');
const ERC20Example = artifacts.require('ERC20Example');

module.exports = deployer => {
  deployer.deploy(DDRMCore, ERC20Example.address);
};
