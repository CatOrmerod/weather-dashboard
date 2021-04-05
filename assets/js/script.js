const apiKey = "4972d2ac99ced943e674efe5c64859c4";
const cityFormEl = document.querySelector("#city-search-form")
const cityInputEl = document.querySelector("#city-input")
const cityContainerEl = document.querySelector('#city-container');
const timeDisplayEl = $("#time-display").val();
const cityNameEl = document.querySelector("#city-name")
const cityIconEl = document.querySelector("#city-icon")
const cityTempEl = document.querySelector("#temp")
const cityHumidEl = document.querySelector("#humid")
const cityWindEl = document.querySelector("#wind")
const cityUVIEl = document.querySelector("#UVI")


let todayDate = moment().format('MMM DD, YYYY [at] hh:mm:ss a');
$("#time-display").html(todayDate);

// let searchBtn = $(".btn-success");
//     searchBtn.on("click", function () {
//         let city = $(this).siblings("#city-input").val().trim();
    
//         localStorage.setItem(city);
//     })

var formSubmitHandler = function (event) {
    event.preventDefault();
  
    const city = cityInputEl.value.trim();
  
    if (city) {
      getWeather(city);
  
    //  cityContainerEl.textContent = '';
      cityInputEl.value = '';
    } else {
      alert('Please enter a city');
    }
};

var getWeather = function (city) {
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
  
    fetch(apiURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data)
            console.log(data.name)
            console.log(data.weather.icon)
            console.log(data.main.temp)
            console.log(data.main.humidity)
            console.log(data.wind.speed)
            console.log(data.main.uvi)  
            cityNameEl.innerHTML = data.name;
            cityIconEl.innerHTML = data.weather.icon;
            cityTempEl.innerHTML = "Temperature: " + data.main.temp;
            cityHumidEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            cityWindEl.innerHTML = "Wind Speed: " + data.wind.speed + " KPH";
            //displayWeather(data, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to retrieve weather');
      });
  };

// var displayWeather = function (data, city) {
    
// }

cityFormEl.addEventListener('submit', formSubmitHandler);
