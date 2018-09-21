const apiKey = 'd238be0dd35e788820b4560ba501a96e' // openweather api key
const cityId = '1621177' // Yogyakarta
const apiUrl = 'https://api.openweathermap.org/data/2.5'
const iconUrl = 'https://openweathermap.org/img/w'

document.body.onload = init

let weatherData = null
let weather5Days = null
async function init () {
  weatherData = await fetchData(`${ apiUrl }/weather?id=${ cityId }&appid=${ apiKey }&units=metric`)
  weather5Days = await fetchData(`${ apiUrl }/forecast?id=${ cityId }&appid=${ apiKey }&units=metric`)
  render()
}

const fetchData = function (url = '') {
  return fetch(url)
  .then( ( res ) => res.json() )
  .then( ( data ) => data )
  .catch( ( err ) => {
    console.log('Error: ', err)
    return null
  } )
}

const currentWeather = document.querySelector('#currentWeather')
const forecastListSection = document.querySelector('#forecastList')

const render = function () {
  if ( weatherData !== null ) {
    let mainHeader = document.createElement('h2')
    mainHeader.innerText = 'Cuaca Sekarang'
    currentWeather.appendChild( mainHeader )
    currentWeather.appendChild( renderWeatherBox( weatherData, 'current' ) )
  }

  if ( weather5Days !== null ) {
    let mainHeader = document.createElement('h2')
    mainHeader.innerText = 'Ramalan Cuaca'
    forecastListSection.appendChild( mainHeader )

    let dateList = []
    
    // create date list
    weather5Days.list.map(( forecast ) => {
      let dt = new Date(forecast.dt*1000)
      let d = `0${ dt.getDate() }`.slice(-2)
      let m = `0${ dt.getMonth() }`.slice(-2)
      let y = dt.getFullYear()
      let h = dt.getHours()
      let fullDate = `${ d }/${ m }/${ y }`
      let dateIndex = dateList.findIndex( ( item ) => item.date === fullDate )

      if ( dateList[ dateIndex ] === undefined ) {
        // check if date index is unavailable in date list
        // then add new object and fill the list with the first forecast item
        dateList.push({ date: fullDate, list: [] })
      } else {
        // if date index is available
        // add the rest data with the same date
        if ( h > 7 && h <= 10 && dateList[ dateIndex ].list[0] === undefined ) { // morning
          dateList[ dateIndex ].list[0] = forecast
        } else if (h > 10 && h < 15 && dateList[ dateIndex ].list[1] === undefined) { // noon
          dateList[ dateIndex ].list[1] = forecast
        } else if (h > 15 && h < 19 && dateList[ dateIndex ].list[2] === undefined) { // after noon
          dateList[ dateIndex ].list[2] = forecast
        } else if (h > 19 && h < 23 && dateList[ dateIndex ].list[3] === undefined) { // night
          dateList[ dateIndex ].list[3] = forecast
        }
      }
    })

    // render 5 days forecast
    dateList.map(( item ) => {
      let newSeparator = document.createElement('div')
      newSeparator.className = 'date-separator'

      let separatorHeader = document.createElement('h3')
      separatorHeader.innerHTML = item.date

      newSeparator.appendChild(separatorHeader)

      item.list.map(( forecast, index) => {
        newSeparator.appendChild( renderWeatherBox( forecast, 'forecast', index) )
      })
      
      if (item.list.length !== 0) {
        forecastListSection.appendChild( newSeparator )
      }
    })
  }
}

const renderWeatherBox = function ( data = {}, type = 'current', index = null ) {
  const times = ['Pagi', 'Siang', 'Sore', 'Malam']
  // create weather-box parent
  let weatherBox = document.createElement('div')
  weatherBox.className = 'weather-box'
  if (type === 'forecast') {
    weatherBox.className = `weather-box ${ times[ index ].toLowerCase() }`
  }

  //first section
  let newSection = document.createElement('section')
  // temp section --start--
  let tempSection = document.createElement('div')
  tempSection.className = 'temp'

  // add image inside temp section
  let iconImg = document.createElement('img')
  iconImg.src = `${ iconUrl }/${ data.weather[0].icon }.png`
  tempSection.appendChild( iconImg )

  // temp in Celcius
  let tempText = document.createElement('span')
  tempText.innerText = `${ Math.floor(data.main.temp )} ˚C`
  tempSection.appendChild( tempText )

  newSection.appendChild( tempSection )
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

  newSection.appendChild( weatherDesc )
  // description section --end--

  if (type === 'current') {
    // weather date
    let weatherDate = document.createElement('div')
    weatherDate.className = 'date'
    weatherDate.innerText = renderDate( data.dt )
    newSection.appendChild( weatherDate )
  } else {
    let weatherDate = document.createElement('div')
    weatherDate.className = 'date'
    weatherDate.innerText = times[ index ]
    newSection.appendChild( weatherDate )
  }

  //add the section to box
  weatherBox.appendChild( newSection )
  // ---- end first section ---

  // ---- second section ----
  newSection = document.createElement('section')

  if (type === 'current') {
    // Sunrise
    let newPhar = document.createElement('p')
    newPhar.innerHTML = `Terbit <span>${ renderDate(data.sys.sunrise).split(' ')[1] }</span>`
    newSection.appendChild( newPhar )

    // Sunset
    newPhar = document.createElement('p')
    newPhar.innerHTML = `Terbenam <span>${ renderDate(data.sys.sunset).split(' ')[1] }</span>`
    newSection.appendChild( newPhar )
  }

  // Wind
  newPhar = document.createElement('p')

  const arrows = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"]
  newPhar.innerHTML = `Angin <span>${ arrows[ Math.floor(( (data.wind.deg + 22) % 360 ) / 45) ] } ${ data.wind.speed } m/s</span>`
  newSection.appendChild( newPhar )

  // Humidity
  newPhar = document.createElement('p')
  newPhar.innerHTML = `Kelembaban <span>${ data.main.humidity }%</span>`
  newSection.appendChild( newPhar )

  //Pressure
  newPhar = document.createElement('p')
  newPhar.innerHTML = `Tekanan <span>${ data.main.pressure } hPa</span>`
  newSection.appendChild( newPhar )

  //add the section to box
  weatherBox.appendChild( newSection )
  // ---- end second section ----

  return weatherBox
}

// const convertTemp = function ( temp = 0 ) {
//   // convert Kelvin to Celcius
//   return Math.floor(temp - 273.15)
// }

const renderDate = function ( timestamp = null ) {
  const dt = new Date( timestamp * 1000 )
  // const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  // let day = dt.getDay()
  let d = `0${ dt.getDate() }`.slice(-2)
  let m = `0${ dt.getMonth() + 1 }`.slice(-2)
  let y = dt.getFullYear()
  let h = `0${ dt.getHours() }`.slice(-2)
  let min = `0${ dt.getMinutes() }`.slice(-2)
  return `${ d }/${ m }/${ y } ${ h }:${ min }`
}
