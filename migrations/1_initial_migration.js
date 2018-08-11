var Migrations = artifacts.require('./Migrations.sol')

module.exports = async function(deployer, network, accounts) {
  web3.eth.getBalance(accounts[0], (err, balance) => {
    console.log(err, web3.fromWei(balance.toString()))
    deployer.deploy(Migrations)
  })
}
