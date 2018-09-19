var ENSNFT = artifacts.require('./ENSNFT.sol')
var Metadata = artifacts.require('./Metadata.sol')
let _ = '        '

const NFTname = 'ENS NIFTY'
const NFTsymbol = 'ENS-NFT'
const ropstenRegistrarAddress = '0xc19fd9004b5c9789391679de6d766b981db94610'
const mainnetRegistrarAddress = '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef'

const ropstenMetadataAddress = '0x8039E1268C6FE15c141D7adA3a96882EdABAfde1'
const mainnetMetadataAddress = '0xbf75f8d6c645684a82f1f25f204dd8d62ff25341'
module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    try {
      // Deploy Metadata.solc
      // await deployer.deploy(Metadata)
      // let metadata = await Metadata.deployed()
      let metadata = {address:
        network === 'mainnet'
        ? mainnetMetadataAddress
        : ropstenMetadataAddress}

      // Deploy ENSNFT.sol
      let registrarAddress =
        network === 'mainnet'
          ? mainnetRegistrarAddress
          : ropstenRegistrarAddress

      await deployer.deploy(
        ENSNFT,
        NFTname,
        NFTsymbol,
        registrarAddress,
        metadata.address
      )
    } catch (error) {
      console.log(error)
    }
  })
}
