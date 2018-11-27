const ERC20Example = artifacts.require('ERC20Example');

module.exports = deployer => {
  deployer.deploy(ERC20Example);
};
