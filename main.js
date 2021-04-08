const api = {
 key: "e56d16ddb7d0f6546328fbf42de90a6c",
 base: "https://api.openweathermap.org/data/2.5/"
}
const aqi = {
  key: "f19abe98-99b6-4874-9002-a41d2754845e",
  base: "https://api.airvisual.com/v2/"
}


const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
const iconElement = document.querySelector(".icon");
const feelElem = document.querySelector('.feelLike')


if('geolocation' in navigator){
  navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
 function setPosition(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
   
  getWeather(latitude, longitude);
  getAirQuality(latitude,longitude)
  weatherForecast(latitude,longitude)

}

function getWeather (latitude, longitude) {
  fetch (`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(displayResults);
  
  }
  function weatherForecast(latitude, longitude) {
    fetch(`${api.base}onecall?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)  
   
    .then(forecast => {
        return forecast.json() 
    }).then(forecastresult);
    
  } 
  
  function getResults (query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(weather => {
        return weather.json();
      }).then(displayResults);
  }
  
// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
    aqisearch(searchbox.value);
  }
}

async function getAirQuality (latitude, longitude) {

  const response  = await fetch(`https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${aqi.key}`);
  const {data}= await response.json();
  console.log (data)
 
  let city = data.city
  let country = data.country
  let state = data.state
  let aqius = data.current.pollution.aqius
  let temperature = data.current.weather.tp
  let hu = data.current.weather.hu
  let ws = data.current.weather.ws

  dispalyAirQuality(response.status,city, state, country,aqius,temperature ,hu,ws)
}

async function aqisearch (city) {
  let state = 'Bangkok';
  let country = 'Thailand';
  let aqius;
  let temperature;
  let hu; 
  let ws;

  const response  = await fetch(`https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${aqi.key}`);
  const {data}= await response.json();


  if (response.status == 200) {
    city = data.city
    country = data.country
    state = data.state  
    aqius = data.current.pollution.aqius
    temperature = data.current.weather.tp
    hu = data.current.weather.hu
    ws = data.current.weather.ws
  }
  
  dispalyAirQuality(response.status, city, state, country,aqius,temperature ,hu,ws)

}

function dispalyAirQuality(status,city, state,country, aqi, temperature, humidtity, wind ){

  const aqiElem = document.querySelector('.aqi .aqiresult ');
  const humidityElem = document.querySelector('.aqi_humidity');
  const windElem = document.querySelector('.aqi_wind');
  const iconAElem = document.querySelector ('.iconA')
  const usaqiElem = document.querySelector('.usaqi')
  const notiTitleElem = document.querySelector('.notititle')
  const notiMessageElem = document.querySelector('.notimessage')
  const feelmessage = document.querySelector('.feelmessage')
  const sevendayElem = document.querySelector('.table')
  
  let title = "";
  let message = "";
  


  if (status == 404){
    aqiElem.innerText ="";
    humidityElem.innerText= "";
    windElem.innerText= "";
    iconAElem.style.visibility = 'hidden';
    usaqiElem.innerText="";
    notiTitleElem.innerText="";
    notiMessageElem.innerText= "";
    sevendayElem.style.visibility = 'hidden';
    
  } else {
    
    aqiElem.innerText= aqi;
    
    if (aqi > 100) {
      title = "Danger"
      message = "Mask Recommended";
    } else if (aqi > 55) {
      title = "Unhealthy";
      message = "Mask Recommended";
    }

    if (aqi < 54) {
      title = "Good"
      message = "";
    }

    sevendayElem.style.visibility = 'visible';
    iconAElem.style.visibility = 'visible';
    notiTitleElem.innerText = title;
    notiMessageElem.innerText = message;
    feelmessage.innerText = "FeelLike"
    usaqiElem.innerText= "US AQI"
    humidityElem.innerText= `Humidity: ${humidtity}`;
    windElem.innerText= `Wind: ${wind} m/s`;  
  }
} 

function displayResults (weather) {
  let city = document.querySelector(' .city ');
  city.innerText = `${weather.name}, ${weather.sys.country}`;
  let now = new Date();
  let date = document.querySelector('.date');
  date.innerText = dateBuilder(now);
  let temp = document.querySelector('.temp');
  iconElement.innerHTML = `<img src="icons/${weather.weather[0].icon}.png"/>`;
  temp.innerHTML = `${Math.round(weather.main.temp)}°c `;
  feelElem.innerHTML = `${Math.round(weather.main.feels_like)}°c`;

  console.log(weather)
  let weather_el = document.querySelector('.weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c | ${Math.round(weather.main.temp_max)}°c`;

}


function forecastresult(forecast){
  
  console.log(forecast)

  
  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(forecast.daily[0].temp.max)}°c | ${Math.round(forecast.daily[0].temp.min)}°c`;


  let tomorrow = document.querySelector ('.tomorrow')
  tomorrow.innerText =`${Math.round(forecast.daily[1].temp.max)}°c | ${Math.round(forecast.daily[1].temp.min)}°c`;

  let iconA = document.querySelector('.ia')
  iconA.innerHTML = `<img src="icons/${forecast.daily[1].weather[0].icon}.png"width="30" height="30"/>`;
  
  let two = document.querySelector ('.two')
  two.innerText =`${Math.round(forecast.daily[2].temp.max)}°c | ${Math.round(forecast.daily[2].temp.min)}°c`;

  let iconB = document.querySelector('.ib')
  iconB.innerHTML = `<img src="icons/${forecast.daily[2].weather[0].icon}.png"width="30" height="30"/>`;

  let three = document.querySelector ('.three')
  three.innerText =`${Math.round(forecast.daily[3].temp.max)}°c | ${Math.round(forecast.daily[3].temp.min)}°c`;

  let iconC = document.querySelector('.ic')
  iconC.innerHTML = `<img src="icons/${forecast.daily[3].weather[0].icon}.png"width="30" height="30"/>`;

  let four = document.querySelector ('.four')
  four.innerText =`${Math.round(forecast.daily[4].temp.max)}°c | ${Math.round(forecast.daily[4].temp.min)}°c`;

  let iconD = document.querySelector('.id')
  iconD.innerHTML = `<img src="icons/${forecast.daily[4].weather[0].icon}.png"width="30" height="30"/>`;
  
  let five = document.querySelector ('.five')
  five.innerText =`${Math.round(forecast.daily[5].temp.max)}°c | ${Math.round(forecast.daily[5].temp.min)}°c`;

  let iconE = document.querySelector('.ie')
  iconE.innerHTML = `<img src="icons/${forecast.daily[5].weather[0].icon}.png"width="30" height="30"/>`;

  let six = document.querySelector ('.six')
  six.innerText =`${Math.round(forecast.daily[6].temp.max)}°c | ${Math.round(forecast.daily[6].temp.min)}°c`;

  let iconF = document.querySelector('.if')
  iconF.innerHTML = `<img src="icons/${forecast.daily[6].weather[0].icon}.png"width="30" height="30"/>`;

  let seven = document.querySelector ('.seven')
  seven.innerText =`${Math.round(forecast.daily[7].temp.max)}°c | ${Math.round(forecast.daily[7].temp.min)}°c`;
  
  let iconG = document.querySelector('.ig')
  iconG.innerHTML = `<img src="icons/${forecast.daily[7].weather[0].icon}.png"width="30" height="30"/>`;

}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`; 
}