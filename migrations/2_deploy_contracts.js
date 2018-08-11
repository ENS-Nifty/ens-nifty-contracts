var ENSNFT = artifacts.require('./ENSNFT.sol')
let _ = '        '

const NFTname = 'ENS NIFTY'
const NFTsymbol = 'ENS-NFT'
const ropstenRegistrarAddress = '0xc19fd9004b5c9789391679de6d766b981db94610'
const mainnetRegistrarAddress = '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef'
module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    try {
      let balance = await web3.eth.getBalance(accounts[0])
      console.log(web3.fromWei(balance.toString()))
      console.log(network)
      // Deploy ENSNFT.sol
      let registrarAddress =
        network === 'mainnet'
          ? mainnetRegistrarAddress
          : ropstenRegistrarAddress
      console.log(network)
      await deployer.deploy(ENSNFT, NFTname, NFTsymbol, registrarAddress)
    } catch (error) {
      console.log(error)
    }
  })
}
