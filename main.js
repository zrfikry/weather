const apiKey = 'd238be0dd35e788820b4560ba501a96e' // openweather api key
const cityId = '1621177' // Yogyakarta
const apiUrl = 'https://api.openweathermap.org/data/2.5'
const iconUrl = 'https://openweathermap.org/img/w'

document.body.onload = init

let weatherData = {}
let weather5Days = {}
async function init () {
  weatherData = await fetchData(`${ apiUrl }/weather?id=${ cityId }&appid=${ apiKey }`)
  weather5Days = await fetchData(`${ apiUrl }/forecast?id=${ cityId }&appid=${ apiKey }`)
  render()
}

const fetchData = function (url = '') {
  return fetch(url)
  .then( ( res ) => res.json() )
  .then( ( data ) => data )
  .catch( ( err ) => {
    console.log('Error: ', err)
    return {}
  } )
}

const currentWeather = document.querySelector('#currentWeather')
const forecastListSection = document.querySelector('#forecastList')

const render = function () {
  currentWeather.innerHTML = ''

  if ( weatherData !== {} ) {
    let mainHeader = document.createElement('h2')
    mainHeader.innerText = 'Current Weather'
    currentWeather.appendChild( mainHeader )
    currentWeather.appendChild( renderWeatherBox( weatherData, 'current' ) )
  }

  if ( weather5Days !== {} ) {
    let mainHeader = document.createElement('h2')
    mainHeader.innerText = '5 Days Forecast'
    forecastListSection.appendChild( mainHeader )

    let dateList = []
    
    // create date list
    weather5Days.list.map(( forecast ) => {
      let dt = new Date(forecast.dt*1000)
      let d = `0${ dt.getDate() }`.slice(-2)
      let m = `0${ dt.getMonth() }`.slice(-2)
      let y = dt.getFullYear()
      let fullDate = `${ d }/${ m }/${ y }`
      let dateIndex = dateList.findIndex( ( item ) => item.date === fullDate )
      if (dateList[ dateIndex ] === undefined) {
        dateList.push({ date: fullDate, list: [] })
      }
    })

    // add data to date list item
    weather5Days.list.map(( forecast ) => {
      let dt = new Date(forecast.dt*1000)
      let d = `0${ dt.getDate() }`.slice(-2)
      let m = `0${ dt.getMonth() }`.slice(-2)
      let y = dt.getFullYear()
      let fullDate = `${ d }/${ m }/${ y }`
      let dateIndex = dateList.findIndex( ( item ) => item.date === fullDate )
      dateList[ dateIndex ].list.push( forecast )
    })

    // render 5 days forecast
    dateList.map(( item ) => {
      let newSeparator = document.createElement('div')
      newSeparator.className = 'date-separator'

      let separatorHeader = document.createElement('h3')
      separatorHeader.innerHTML = item.date

      newSeparator.appendChild(separatorHeader)

      item.list.map(( forecast ) => {
        newSeparator.appendChild( renderWeatherBox( forecast ) )
      })
      
      forecastListSection.appendChild( newSeparator )
    })
  }
}

const renderWeatherBox = function ( data = {} ) {
  // create weather-box parent
  let weatherBox = document.createElement('div')
  weatherBox.className = 'weather-box'

  // header inside weather-box
  // if ( data.name !== undefined ) {
  //   let weatherBoxHeader = document.createElement('h3')
  //   weatherBoxHeader.innerText = data.name
  //   weatherBox.appendChild( weatherBoxHeader )
  // }

  // temp section --start--
  let tempSection = document.createElement('div')
  tempSection.className = 'temp'

  // add image inside temp section
  let iconImg = document.createElement('img')
  iconImg.src = `${ iconUrl }/${ data.weather[0].icon }.png`
  tempSection.appendChild( iconImg )

  // temp in Celcius
  let tempText = document.createElement('span')
  tempText.innerText = `${ convertTemp( data.main.temp ) } ˚C`
  tempSection.appendChild( tempText )

  weatherBox.appendChild( tempSection )
  // temp section --end--

  // description section --start--
  let weatherDesc = document.createElement('div')
  weatherDesc.className = 'description'

  // add image inside temp section
  let desc1 = document.createElement('p')
  desc1.innerText = data.weather[0].main
  weatherDesc.appendChild( desc1 )

  // temp in Celcius
  let desc2 = document.createElement('p')
  desc2.innerText = data.weather[0].description
  weatherDesc.appendChild( desc2 )

  weatherBox.appendChild( weatherDesc )
  // description section --end--

  // weather date
  let weatherDate = document.createElement('div')
  weatherDate.className = 'date'
  weatherDate.innerText = renderDate( data.dt )
  weatherBox.appendChild( weatherDate )

  return weatherBox
}

const convertTemp = function ( temp = 0 ) {
  return Math.floor(temp - 273.15)
}

const renderDate = function ( timestamp = null ) {
  const dt = new Date( timestamp * 1000 )
  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  let day = dt.getDay()
  let d = `0${ dt.getDate() }`.slice(-2)
  let m = `0${ dt.getMonth() + 1 }`.slice(-2)
  let y = dt.getFullYear()
  let h = `0${ dt.getHours() }`.slice(-2)
  let min = `0${dt.getMinutes()}`.slice(-2)
  return `${ d }/${ m }/${ y } ${ h }:${ min }`
}
