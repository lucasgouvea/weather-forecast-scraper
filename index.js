const puppeteer = require('puppeteer')
var fs = require('fs');


function parseArrays(tArray, dArray, hArray){
    var auxArray = [0,3,11,19,27,35,43,48,52,56,60]
    var parsedArray = ''
    var j = 0
    for(i=0;i<60;i++){
        if(auxArray.indexOf(i)  >= 0){
            parsedArray += (dArray[j] + '\r\n')
            parsedArray += (hArray[i] + ' : ' + tArray[i] + '\r\n')
            j++
        }else{
            parsedArray += (hArray[i] + ' : ' + tArray[i] + '\r\n')
        }

    }
    return parsedArray
}

let scrape = async () => {
    try{
        
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        page.setDefaultNavigationTimeout(120000)
        var url = 'https://weather.us/forecast/3460834-itajuba/xltrend'
        console.log("Going to: " + url)
        await page.goto(url, {waitUntil: 'networkidle0'} )
        page.waitFor(5000)
        //get temperatureArray
        console.log("Getting temperature array...")
        const temperatureArray = await page.evaluate(() => {
            let selectorPrefix = '#collapse-'
            let selectorSufix = '> div > div > div.col-sm-8 > div:nth-child(2) ' +
                '> div.col-xs-6.col-sm-7'
            let temperatureArray = []
            let temperature = ''
            for(i=1;i<61;i++){
                temperature = document.querySelector(selectorPrefix + i + selectorSufix).innerText
                temperatureArray.push(temperature)
            }
            return Promise.resolve(temperatureArray)
        })
        //get hours        
        console.log("Getting hours array...")
        const hourArray = await page.evaluate(() => {
            let selectorPrefix = '#heading-'
            let selectorSufix = ' > div > div.col-xs-4.col-sm-3.panel-div'
            let hourArray = []
            for(i=1;i<61;i++){
                hour = document.querySelector(selectorPrefix + i + selectorSufix).innerText
                hourArray.push(hour)
            }
            return Promise.resolve(hourArray)
        })
        //get dates
        console.log("Getting dates...")
        const dateArray = await page.evaluate(() => {
            let selectorPrefix = '#forecast-daytable > div:nth-child('
            let selectorSufix = ') > div > div > div.panel-heading'
            let dateArray = []
            let date = ''
            for(i=2;i<=20;i=i+2){
                date = document.querySelector(selectorPrefix + i + selectorSufix).innerText
                dateArray.push(date)
            }
            return Promise.resolve(dateArray)
        })
        /*Mocks
        const temperatureArray = [ '53.2°','52°','46.2°','42.8°','54.5°',
          '64.2°','69.1°','58.5°','53.1°','45.7°','44.4°','43.3°','57.2°','68.2°',
          '71.2°','61.3°','52.5°','49.5°','45.7°','44.6°','56.1°','68.4°','72°',
          '63.5°','53.2°','48.9°','47.8°','47.8°','57.9°','68.5°','73.2°','62.8°',
          '54°','51.1°','52.2°','51.3°','62.6°','72.7°','75.7°','63.9°','58.5°',
          '54.9°','52°','52.5°','59.2°','73.4°','60.4°','57°','62.8°','72.3°',
          '61.5°','59.5°','60.3°','67.3°','57.6°' ]
        const dateArray = [ 'Friday, August the 10th, 2018',
          'Saturday, August the 11th, 2018','Sunday, August the 12th, 2018',
          'Monday, August the 13th, 2018','Tuesday, August the 14th, 2018',
          'Wednesday, August the 15th, 2018','Thursday, August the 16th, 2018',
          'Friday, August the 17th, 2018','Saturday, August the 18th, 2018',
          'Sunday, August the 19th, 2018' ]
        */
        var parsedArray = parseArrays(temperatureArray, dateArray, hourArray)
        return parsedArray
    }
    catch(err){
        return err
    }
}

scrape().then(function(array){
    var date = (new Date()).toString().substr(4,11)
        .replace(':','-').replace(/ /g,'-')
    var filename = date + '.txt'
    fs.writeFile(filename, array, (err) =>{
        if (err) throw err
        console.log('Saved data to' + filename)
    })
}, function(err){
    console.log(err)
})