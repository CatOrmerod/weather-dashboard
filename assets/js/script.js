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
const fiveDayContainerEl = document.querySelector("#five-day-container")

let cityHistoryArr = [];



let todayDate = moment().format('MMM DD, YYYY [at] hh:mm:ss a');
$("#time-display").html(todayDate);

var formSubmitHandler = function (event) {
    event.preventDefault();
  
    const city = cityInputEl.value.trim();
  
    if (city) {
      getLatLon(city);
      cityHistoryArr.unshift({city})
      cityInputEl.value = '';
    } else {
      alert('Please enter a city');
    }
    saveSearch();
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
            fiveDayForecast(data)
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

var fiveDayForecast = function (data) {
  for (var i = 1; i < 6; i++) {
    var forecastDateEl = document.createElement("p");
    var forecastIconEl = document.createElement("img");
    var forecastTempEl = document.createElement("p");
    var forecastHumidEl = document.createElement("p");
    forecastDateEl.innerHTML = data.daily[i].dt;
    let forecastIcon = data.daily[i].weather[0].icon;
    forecastIconEl.setAttribute("src","https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
    forecastIconEl.setAttribute("alt",data.daily[i].weather[0].description);
    forecastTempEl.innerHTML = "Temperature: " + data.daily[i].temp.day;
    forecastHumidEl.innerHTML = "Humidity: " + data.daily[i].humidity + "%";

    fiveDayContainerEl.appendChild(forecastDateEl);
    fiveDayContainerEl.appendChild(forecastIconEl);
    fiveDayContainerEl.appendChild(forecastTempEl);
    fiveDayContainerEl.appendChild(forecastHumidEl);
  }
}

var saveSearch = function(cityLat, cityLon) {
  cityInputEl = document.getElementById("city-input").value;
  var citySearchData = {
    city: cityInputEl,
    lat = cityLat,
    lon = cityLon,
  };
  let cityHistoryArr = JSON.parse(localStorage.getItem("cityHistoryArr") || "[]");
  cityHistoryArr.push(citySearchData);
  localStorage.setItem("cityHistoryArr", JSON.stringify(cityHistoryArr));
  console.log(cityHistoryArr);
  console.log(citySearchData);
  console.log(lat);
}

document.getElementById("cityContainerEl").addEventListener("click", function(e){
  var cityHistoryArr = JSON.parse(localStorage.getItem("citySearchData") || "[]");
    for (let i = 0; i<cityHistoryArr.length; i++) {
      var citySearchBtn = document.createElement("button");
      citySearchBtn.classList = "btn btn-info btn-block";
      citySearchBtn.setAttribute("type", "submit");
      citySearchBtn.textContent = cityHistoryArr[i].city;
      document.getElementById("cityContainerEl").appendChild(citySearchBtn);
    }
})


var buttonHandler = function(event){
  cityHistoryArr = JSON.parse(localStorage.getItem("citySearchData") || "[]");
  console.log(cityHistoryArr);
  getWeather(cityLat, CityLon)
  }
}      

cityFormEl.addEventListener('submit', formSubmitHandler);
cityContainerEl.addEventListener("click", buttonHandler);
