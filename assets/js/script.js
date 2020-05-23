var cityInput = document.getElementById("searchBar");
var searchBtn = document.getElementsByTagName("button");

// get information from API for current day
$(searchBtn).on("click", function (event) {
  event.preventDefault();

  var searchCity = cityInput.value;
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    searchCity +
    "&APPID=d536df736fe4039cfe9ab0fe57652858";

  $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
    var cityName = response.name;
    var today = moment().format("(MM/DD/YYYY)");
    var temperature =
      Math.round((response.main.temp - 273.15) * 1.8 + 32) + " \u00B0F";
    //To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
    var humidity = response.main.humidity + "%";
    var windSpeed = response.wind.speed + " MPH";
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var uvIndex;
    // uvindex is in another API so I need to call that using lat and lon
    var url2 =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&exclude=hourly,daily&appid=d536df736fe4039cfe9ab0fe57652858";

    $.ajax({
      url: url2,
      method: "GET",
    }).then(function (response) {
      uvIndex = response.current.uvi;
      $("#currentWeather").html(
        `<strong>${cityName} ${today}</strong></br><div>Temperature: ${temperature}</div><div>Humidity: ${humidity}</div><div>Wind Speed: ${windSpeed}</div>`
      );
      var uvCondition; // Create conditional statement to determine this value
      // creating uv index separately so that it can be chan
      var uvDiv = document.createElement("div");
      var test = $(uvDiv).html(
        `UV Index: <span class = ${uvCondition}>${uvIndex}<span>`
      );
      $("#currentWeather").append(uvDiv);
    });
    // adding current weather to the existing HTML tag
  });
});
