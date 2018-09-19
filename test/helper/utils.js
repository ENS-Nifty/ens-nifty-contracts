const BigNumber = require('bignumber.js')
const utils = require('web3-utils')

const defaultGas = new BigNumber('100000000000') // 100 Shanon
const ethPrice = new BigNumber('300')
const oneGwei = new BigNumber('1000000000') // 1GWEI

let _ = '        '
module.exports._ = _

module.exports.p = function(func, params) {
  return new Promise((resolve, reject) => {
    func(...params, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}



module.exports.gasToCash = function(totalGas) {
  BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 })

  if (typeof totalGas !== 'object') totalGas = new BigNumber(totalGas)
  let lowGwei = oneGwei.mul(new BigNumber('8'))
  let highGwei = oneGwei.mul(new BigNumber('20'))
  let lowTotal = new BigNumber(utils.fromWei(totalGas.mul(lowGwei).toString()))
  let highTotal = new BigNumber(utils.fromWei(totalGas.mul(highGwei).toString()))
  console.log(
    _ +
      _ +
      lowTotal.toFixed(2) + 'ETH ' +
      '$' +
        lowTotal
        .mul(ethPrice)
        .toFixed(2) +
      ' @ 8 GWE & ' +
      ethPrice +
      '/USD'
  )
  console.log(
    _ +
      _ +
      highTotal.toFixed(2) + 'ETH ' +
      '$' +
        highTotal
        .mul(ethPrice)
        .toFixed(2) +
      ' @ 20 GWE & ' +
      ethPrice +
      '/USD'
  )
}
