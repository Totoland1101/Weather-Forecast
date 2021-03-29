const api = {
 key: "e56d16ddb7d0f6546328fbf42de90a6c",
 base: "https://api.openweathermap.org/data/2.5/"
}
const aqi = {
  key: "f19abe98-99b6-4874-9002-a41d2754845e",
  base: "https://api.airvisual.com/v2/"
}

// const key = `c3d4c8fd-a05c-475a-8ae4-04bde3951bfa`

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
const iconElement = document.querySelector(".weather-icon");

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
}

function getWeather (latitude, longitude) {
  fetch (`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
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

function getResults (query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(displayResults);
}


async function getAirQuality (latitude, longitude) {

  const response  = await fetch(`https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${aqi.key}`);
  const {data}= await response.json();
  // console.log (data.current)
 
  let city = data.city
  let country = data.country
  let state = data.state
  let aqius = data.current.pollution.aqius
  let temperature = data.current.weather.tp
  let hu = data.current.weather.hu
  let ws = data.current.weather.ws

  dispalyAirQuality(response.status,city, state, country,aqius,temperature ,hu,ws)
}

function displayResults (weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;
  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);
  let temp = document.querySelector('.current .temp');
  iconElement.innerHTML = `<img src="icons/${weather.weather[0].icon}.png"/>`;
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;


  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

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

function dispalyAirQuality(status,city, state,country, aqi, temperature, humidtity, wind){

  const aqiElem = document.querySelector('.aqi .aqiresult ');
  const humidityElem = document.querySelector('.aqi_humidity');
  const windElem = document.querySelector('.aqi_wind');
  const textElem = document.querySelector('.text')    
  const usaqiElem = document.querySelector('.usaqi')
  const notiTitleElem = document.querySelector('.notititle')
  const notiMessageElem = document.querySelector('.notimessage')
  const tcElem = document.querySelector('.tc')
  let title = "";
  let message = "";
  


  if (status == 404){
    aqiElem.innerText ="";
    humidityElem.innerText= "";
    windElem.innerText= "";
    textElem.innerText= "";
    usaqiElem.innerText="";
    notiTitleElem.innerText="";
    notiMessageElem.innerText= "";
    tcElem.innerText = "";
  } else {
    textElem.innerText= 'PM 2.5 Quality Nearby Your Location'
    aqiElem.innerText= aqi;
    
    if (aqi > 100) {
      title = "Danger"
      message = "mask recommended";
    } else if (aqi > 60) {
      title = "Unhealty";
      message = "mask recommended";
    }
    notiTitleElem.innerText = title;
    notiMessageElem.innerText = message;
    tcElem.innerText = "°C";
    // usaqiElem.innerText= 'PM 2.5 Quality'
    humidityElem.innerText= `Humidity: ${humidtity}`;
    windElem.innerText= `Wind: ${wind} m/s`;  
  }
} 



