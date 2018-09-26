var ENSNFT = artifacts.require('./ENSNFT.sol')
var Metadata = artifacts.require('./Metadata.sol')
let _ = '        '

// const ropstenMetadataAddress = '0xe05e2bdc5a003515b8b4f4901dd0da495b6f6c96'
// const mainnetMetadataAddress = '0xbf75f8d6c645684a82f1f25f204dd8d62ff25341'
module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    return
    try {
      // Deploy Metadata.solc
      let metadata = await deployer.deploy(Metadata)
      // let metadata = await Metadata.deployed()
      let ensnft = await ENSNFT.deployed()
      console.log(ensnft.address + ' is ensnft')
      var tx = await ensnft.updateMetadata(metadata.address)

    } catch (error) {
      console.log(error)
    }
  })
}
