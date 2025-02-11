const Migrations = artifacts.require("product");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
