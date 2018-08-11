var utils = require('web3-utils')
var TestENSRegistry = artifacts.require('./TestENSRegistry.sol')
var TestRegistrar = artifacts.require('./TestRegistrar.sol')
var ENSNFT = artifacts.require('./ENSNFT.sol')

const defaultGas = new web3.BigNumber('100000000000') // 100 Shanon
const ethPrice = new web3.BigNumber('300')
const oneGwei = new web3.BigNumber('1000000000') // 1GWEI

const NFTname = 'ENS NIFTY'
const NFTsymbol = 'ENS-NFT'

const rootNode = web3.keccak256('ensnft') // TLD

let _ = '        '

contract('ENSNFT', async function(accounts) {
  let _ENSNFT, _TestENSRegistry, _TestRegistrar

  before(done => {
    ;(async () => {
      try {
        var totalGas = new web3.BigNumber(0)

        // Deploy TestENSRegistry.sol
        _TestENSRegistry = await TestENSRegistry.new()
        var tx = web3.eth.getTransactionReceipt(
          _TestENSRegistry.transactionHash
        )
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy _TestENSRegistry')
        _TestENSRegistry = await TestENSRegistry.deployed()
        gasToCash(tx.gasUsed)

        // Deploy Registrar.sol
        _TestRegistrar = await TestRegistrar.new(
          _TestENSRegistry.address,
          rootNode,
          '0'
        )
        var tx = web3.eth.getTransactionReceipt(_TestRegistrar.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy _TestRegistrar')
        _TestRegistrar = await TestRegistrar.deployed()
        gasToCash(tx.gasUsed)

        // Deploy ENSNFT.sol
        _ENSNFT = await ENSNFT.new(NFTname, NFTsymbol, _TestRegistrar.address)
        var tx = web3.eth.getTransactionReceipt(_ENSNFT.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy _ENSNFT')
        _ENSNFT = await ENSNFT.deployed()
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

  describe('ENS.sol', function() {
    const node = web3.keccak256('testname')
    it('should add owner and read same owner', async function() {
      const sealedBid = await _TestRegistrar.shaBid(
        node,
        eth.accounts[0],
        web3.toWei(0.01, 'ether'),
        web3.sha3('secret')
      )
      await _TestRegistrar.startAuctionsAndBid([node], sealedBid, {
        value: web3.toWei(0.01, 'ether')
      })
      let state = _TestRegistrar.state(node)
      console.log(state)
      assert(owner.toString === accounts[0].toString(), '')
    })

    it('should register an ENS')
  })

  describe('ENS.sol', function() {
    it('should pass', async function() {
      assert(true === true, 'this is true')
    })

    it('should register an ENS')
  })
})

function gasToCash(totalGas) {
  web3.BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 })

  if (typeof totalGas !== 'object') totalGas = new web3.BigNumber(totalGas)
  let lowGwei = oneGwei.mul(new web3.BigNumber('8'))
  let highGwei = oneGwei.mul(new web3.BigNumber('20'))

  console.log(
    _ +
      _ +
      '$' +
      new web3.BigNumber(utils.fromWei(totalGas.mul(lowGwei).toString()))
        .mul(ethPrice)
        .toFixed(2) +
      ' @ 8 GWE & ' +
      ethPrice +
      '/USD'
  )
  console.log(
    _ +
      _ +
      '$' +
      new web3.BigNumber(utils.fromWei(totalGas.mul(highGwei).toString()))
        .mul(ethPrice)
        .toFixed(2) +
      ' @ 20 GWE & ' +
      ethPrice +
      '/USD'
  )
}

function getBlockNumber() {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}

function increaseBlocks(blocks) {
  return new Promise((resolve, reject) => {
    increaseBlock().then(() => {
      blocks -= 1
      if (blocks == 0) {
        resolve()
      } else {
        increaseBlocks(blocks).then(resolve)
      }
    })
  })
}

function increaseBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: 12345
      },
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      }
    )
  })
}

function decodeEventString(hexVal) {
  return hexVal
    .match(/.{1,2}/g)
    .map(a =>
      a
        .toLowerCase()
        .split('')
        .reduce(
          (result, ch) => result * 16 + '0123456789abcdefgh'.indexOf(ch),
          0
        )
    )
    .map(a => String.fromCharCode(a))
    .join('')
}
