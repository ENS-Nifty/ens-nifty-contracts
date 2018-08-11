var Migrations = artifacts.require('./Migrations.sol')

module.exports = async function(deployer, network, accounts) {
  return
  try {
    let balance = await new Promise((resolve, reject) => {
      web3.eth.getBalance(accounts[0], (rej, res) => {
        if (rej) reject(rej)
        resolve(res)
      })
    })

    console.log('balance', web3.fromWei(balance.toString()))
    let nonce = await new Promise((resolve, reject) => {
      web3.eth.getTransactionCount(accounts[0], (rej, res) => {
        if (rej) reject(rej)
        resolve(res)
      })
    })
    console.log('nonce', nonce.toString())
    deployer.deploy(Migrations)
  } catch (error) {
    console.log(error)
  }
}
