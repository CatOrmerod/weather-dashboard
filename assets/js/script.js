// Global Variables
const apiKey = "4972d2ac99ced943e674efe5c64859c4";
const cityFormEl = document.querySelector("#city-search-form")
const cityInputEl = document.querySelector("#city-input")
const cityContainerEl = document.querySelector("#city-container");
const timeDisplayEl = $("#time-display").val();
const cityNameEl = document.querySelector("#city-name")
const cityIconEl = document.querySelector("#city-icon")
const cityTempEl = document.querySelector("#temp")
const cityHumidEl = document.querySelector("#humid")
const cityWindEl = document.querySelector("#wind")
const cityUVIEl = document.querySelector("#UVI")
const fiveDayContainerEl = document.querySelector("#five-day-container")

let cityHistoryArr = [];

// function to get the city name from the input field
var formSubmitHandler = function (event) {
  event.preventDefault();

  const city = cityInputEl.value.trim();

  if (city) {
    getLatLon(city);
    cityHistoryArr.unshift({ city })
    cityInputEl.value = '';
  } else {
    alert('Please enter a city');
  }
};

// function to obtain the lat & lon coordinates from the city name
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
          getWeather(cityLat, cityLon, city)
          saveSearch(city, cityLat, cityLon);
          createBtn(city, cityLat, cityLon);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to retrieve weather');
    });
};
//Function to get all of the information from the API to populate the fields in the follwowing functions (display & 5 day)
var getWeather = function (cityLat, cityLon, city) {
  let apiLLURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + apiKey + "&units=metric";

  fetch(apiLLURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          displayWeather(data, city)
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
  var cityDate = document.createElement("span");
  cityDate.textContent = " (" + moment.unix(data.current.dt).format("MMM D, YYYY") + ") ";
  cityNameEl.appendChild(cityDate);
  let weatherIcon = data.current.weather[0].icon;
  cityIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
  cityIconEl.setAttribute("alt", data.current.weather[0].description);
  cityTempEl.innerHTML = "Temperature: " + data.current.temp + " °C";
  cityHumidEl.innerHTML = "Humidity: " + data.current.humidity + "%";
  cityWindEl.innerHTML = "Wind Speed: " + data.current.wind_speed + " KPH";
  cityUVIEl.innerHTML = "UV Index: " + data.current.uvi;
  UVIndex(data)
}

//function to colour the UV index based on severity
var UVIndex = function (data) {
  if (data.current.uvi < 4) {
    cityUVIEl.setAttribute("class", "badge badge-success");
  }
  else if (data.current.uvi < 8) {
    cityUVIEl.setAttribute("class", "badge badge-warning");
  }
  else {
    cityUVIEl.setAttribute("class", "badge badge-danger");
  }
}
//displaying data for the next 5 days
var fiveDayForecast = function (data) {
  fiveDayContainerEl.textContent = ""

  for (var i = 1; i < 6; i++) {
    var fiveDayEl = document.createElement("div");
    fiveDayEl.classList = "card bg-primary text-light m-2";

    var forecastDateEl = document.createElement("p");
    var forecastIconEl = document.createElement("img");
    var forecastTempEl = document.createElement("p");
    var forecastHumidEl = document.createElement("p");

    forecastDateEl.innerHTML = moment.unix(data.daily[i].dt).format("MMM D, YYYY");
    let forecastIcon = data.daily[i].weather[0].icon;
    forecastIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
    forecastIconEl.setAttribute("alt", data.daily[i].weather[0].description);
    forecastTempEl.innerHTML = "Temp: " + data.daily[i].temp.day + " °C";
    forecastHumidEl.innerHTML = "Humidity: " + data.daily[i].humidity + "%";

    fiveDayEl.appendChild(forecastDateEl);
    fiveDayEl.appendChild(forecastIconEl);
    fiveDayEl.appendChild(forecastTempEl);
    fiveDayEl.appendChild(forecastHumidEl);

    fiveDayContainerEl.appendChild(fiveDayEl);
  }
}
//function to save the city, lon and lat into local storage in order to populate buttons when opening page
var saveSearch = function (city, cityLat, cityLon) {
  var citySearchData = {
    city: city,
    cityLat: cityLat,
    cityLon: cityLon,
  };
  let cityHistoryArr = JSON.parse(localStorage.getItem("cityHistoryArr") || "[]");
  cityHistoryArr.push(citySearchData);
  localStorage.setItem("cityHistoryArr", JSON.stringify(cityHistoryArr));
  console.log(cityHistoryArr);
  console.log(citySearchData);
  console.log(city);
}

//function to create buttons that will sit on the page, incl the lat & lon coordinates for future use
var createBtn = function (city, cityLat, cityLon) {
  var citySearchBtn = document.createElement("button");
  citySearchBtn.classList = "d-flex w-100 btn-light border p-2";
  citySearchBtn.setAttribute("type", "submit");
  citySearchBtn.setAttribute("data-lat", cityLat);
  citySearchBtn.setAttribute("data-lon", cityLon);
  citySearchBtn.textContent = city;
  console.log(cityContainerEl);
  cityContainerEl.append(citySearchBtn);
  citySearchBtn.addEventListener("click", buttonHandler)
}

//function to create buttons from the local storage
var createBtnFromStorage = function () {
  var cityHistoryArr = JSON.parse(localStorage.getItem("cityHistoryArr") || "[]");
  for (let i = 0; i < cityHistoryArr.length; i++) {
    createBtn(cityHistoryArr[i].city, cityHistoryArr[i].cityLat, cityHistoryArr[i].cityLon);
  }
}

//function to tell the page what to do when a button is clicked
var buttonHandler = function (event) {
  console.log($(this));
  let city = $(this).text();
  let lat = $(this).data("lat");
  let lon = $(this).data("lon");
  getWeather(lat, lon, city);
  console.log(event.target);
}

//function to show the user their current position weather on opening the page
var getLocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert('Geolocation is not supported by this browser');
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(position)
  console.log(lat);
  console.log(lon);
  cityNameEl.innerHTML = "Your current location"
  getCityReverse(lat, lon);
}

function getCityReverse(lat, lon) {
  let reverseAPIURL = "https://api.openweathermap.org/geo/1.0/reverse?&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

  fetch(reverseAPIURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          console.log(response.name);
          let city = name
          getWeather(lat, lon, city)
        });
      }
    });
}

cityFormEl.addEventListener('submit', formSubmitHandler);
        createBtnFromStorage()
        getLocation()
