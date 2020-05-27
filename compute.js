const spank = require('./spank_p20.js')
const weth = require('./weth_p20.js')

/*
{
    "data": {
      "exchangeDayDatas": [
        {
          "__typename": "ExchangeDayData",
          "date": 1574899200,
          "ethBalance": "903.226360624404500325",
          "ethVolume": "18.739073395092354961",
          "marginalEthRate": "37129.37847162",
          "tokenBalance": "33536233.389176477412725484",
          "tokenPriceUSD": "0.004150810566160639206358847114510462892724654046440273028235907480952238747378666940858025275269247428",
          "totalEvents": "9"
        },
*/

const dayInSeconds = 60 * 60 * 24
const currentTimestamp = (new Date()).getTime()

const getTotalVolumeAndFees = (days) => {
    const startingTimestamp = currentTimestamp - (days * dayInSeconds * 1000)
    const startingDate = new Date(startingTimestamp)

    const isAfterStartingDate = (exchangeDayData) => {
        return new Date(exchangeDayData.date * 1000) > startingDate
    }

    const filteredSpankData = spank.data.exchangeDayDatas.filter(isAfterStartingDate)
    const filteredWethData = weth.data.exchangeDayDatas.filter(isAfterStartingDate)

    if (filteredSpankData[0].date != filteredWethData[0].date) {
        throw new Error('starting dates are not aligned')
    }

    let totalUSDVolume = 0
    for (let i = 0; i < filteredSpankData.length; i++) {
        totalUSDVolume += filteredSpankData[i].ethVolume * filteredWethData[i].tokenPriceUSD
    }

    console.log('Results for last '+days+' days')
    console.log('Total USD Volume', totalUSDVolume)
    console.log('Total USD fees', totalUSDVolume * .003)
}

getTotalVolumeAndFees(30)
getTotalVolumeAndFees(60)