const apiKey = "4972d2ac99ced943e674efe5c64859c4";
const cityInputEl = $("#city-input").val();
const searchInputEl = $(".btn-success");
const timeDisplayEl = $("#time-display").val();



let todayDate = moment().format('MMM DD, YYYY [at] hh:mm:ss a');
$("#time-display").html(todayDate);

let searchBtn = $(".btn-success");
    searchBtn.on("click", function () {
        let city = $(this).siblings("#city-input").val().trim();
    
        localStorage.setItem(city);
    })


function getWeather() {
    let city = $("#city-input").val();
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
        fetch(apiURL);
        console.log(apiURL);
        
}

$("#city-input").click(function() { 
    getWeather();
});

