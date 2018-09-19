var Metadata = artifacts.require('./Metadata.sol')
var ENSNFT = artifacts.require('./ENSNFT.sol')

const NFTname = 'ENS NIFTY'
const NFTsymbol = 'ENS-NFT'

const {_, p, gasToCash} = require('./helper/utils')

contract('Metadata', async function(accounts) {
  let _ENSNFT, _TestENSRegistry, _TestRegistrar, _Metadata

  before(done => {
    ;(async () => {
      try {
        var totalGas = new web3.BigNumber(0)

        // Deploy Metadata.sol
        _Metadata = await Metadata.new()
        var tx = await p(web3.eth.getTransactionReceipt, [_Metadata.transactionHash])
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy _Metadata')
        gasToCash(tx.gasUsed)

        // Deploy ENSNFT.sol
        // _ENSNFT = await ENSNFT.new(NFTname, NFTsymbol, _TestRegistrar.address, _Metadata.address)
        _ENSNFT = await ENSNFT.new(NFTname, NFTsymbol, accounts[0], _Metadata.address)
        var tx = await p(web3.eth.getTransactionReceipt,[_ENSNFT.transactionHash])
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy _ENSNFT')
        gasToCash(tx.gasUsed)

        console.log(_ + '-----------------------')
        console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
        gasToCash(totalGas)

        done()
      } catch (error) {
        console.error(error)
        done(false)
      }
    })()
  })


  describe('Metadata.sol', function() {
    it('should be able to read metadata', async function() {
      let metadata = await _ENSNFT.tokenURI(666)
      let _metadata = await _Metadata.tokenURI(666)
      assert(_metadata === metadata, '_metadata != metadata')
    })
  })
})
