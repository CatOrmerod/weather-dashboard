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
      getLatLon(city);
  
    //  cityContainerEl.textContent = '';
      cityInputEl.value = '';
    } else {
      alert('Please enter a city');
    }
};

var getLatLon = function (city) {
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
  
    fetch(apiURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {  
            console.log(data.coord.lon)
            console.log(data.coord.lat)
            let cityLat = data.coord.lat
            let cityLon = data.coord.lon
            getWeather(cityLat, cityLon)
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to retrieve weather');
      });
  };

var getWeather = function (cityLat, cityLon) {
    let apiLLURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + apiKey + "&units=metric";
  
    fetch(apiLLURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {  
              console.log(data)
            displayWeather(data)
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to retrieve weather');
      });
  };

var displayWeather = function (data, city) {
        cityNameEl.innerHTML = city;
        let weatherIcon = data.current.weather[0].icon;
        cityIconEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
        cityIconEl.setAttribute("alt",data.current.weather[0].description);
        cityTempEl.innerHTML = "Temperature: " + data.current.temp;
        cityHumidEl.innerHTML = "Humidity: " + data.current.humidity + "%";
        cityWindEl.innerHTML = "Wind Speed: " + data.current.wind_speed + " KPH";
        cityUVIEl.innerHTML = "UV Index: " + data.current.uvi;
        UVIndex(data)
}

var UVIndex = function (data) {
    if (data.current.uvi < 4 ) {
        cityUVIEl.setAttribute("class", "badge badge-success");
    }
    else if (data.current.uvi < 8) {
        cityUVIEl.setAttribute("class", "badge badge-warning");
    }
    else {
        cityUVIEl.setAttribute("class", "badge badge-danger");
    }
}

cityFormEl.addEventListener('submit', formSubmitHandler);
