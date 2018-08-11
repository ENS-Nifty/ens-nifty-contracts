var utils = require('web3-utils')
var ENS = artifacts.require('./tests/ENS.sol')
var ENSNFT = artifacts.require('./ENSNFT.sol')

const defaultGas = new web3.BigNumber('100000000000') // 100 Shanon
const ethPrice = new web3.BigNumber('300')
const oneGwei = new web3.BigNumber('1000000000') // 1GWEI

const NFTname = 'ENS NIFTY'
const NFTsymbol = 'ENS-NFT'

let _ = '        '

contract('ENSNFT', async function(accounts) {
  let _ENSNFT, _ENS

  before(done => {
    ;(async () => {
      try {
        var totalGas = new web3.BigNumber(0)

        // Deploy ENS.sol
        eNs = await ENS.new()
        var tx = web3.eth.getTransactionReceipt(_ENS.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy _ENS')
        _ENS = await ENS.deployed()
        gasToCash(tx.gasUsed)

        // Deploy ENSNFT.sol
        _ENSNFT = await ENSNFT.new(NFTname, NFTsymbol, _ENS.address)
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
    const node = web3.sha3('Hello World!')
    it('should add owner and read same owner', async function() {
      await _ENS.setOwner(node, accounts[0])
      const owner = _ENS.owner(node)
      assert(owner.toString === accounts[0].toString())
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
