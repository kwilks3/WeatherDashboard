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
    var currentIcon = response.weather[0].icon;
    // get icon from separate link
    var iconUrl = "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png";
    // uvindex is in another API so I need to call that using lat and lon
    var uvUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&exclude=hourly,daily&appid=d536df736fe4039cfe9ab0fe57652858";
    // get current uv index and display based on condition
    $.ajax({
      url: uvUrl,
      method: "GET",
    }).then(function (response) {
      uvIndex = response.current.uvi;
      $("#currentWeather").html(
        `<strong>${cityName} ${today}</strong><img src= "${iconUrl}" alt = "current weather icon"/></br><div>Temperature: ${temperature}</div><div>Humidity: ${humidity}</div><div>Wind Speed: ${windSpeed}</div>`
      );
      var uvCondition;
      if (uvIndex <= 2) {
        uvCondition = "badge badge-success";
      } else if (uvIndex > 2 && uvIndex < 8) {
        uvCondition = "badge badge-warning";
      } else uvCondition = "badge badge-danger";
      // adding current weather to the existing HTML tag
      // creating uv index separately so that it can be changed based in UV condition
      var uvDiv = document.createElement("div");
      $(uvDiv).html(
        `UV Index: <span class = "${uvCondition}">${uvIndex}<span>`
      );
      $("#currentWeather").append(uvDiv);
    });
    // get five day forecast and display to page

    var futureUrl =
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=d536df736fe4039cfe9ab0fe57652858";
    // create a for loop to get all days the 0th day is today so start at 1 and grab the first 5 days

    for (var i = 0; i < 6; i++) {
      $.ajax({
        url: futureUrl,
        method: "GET",
      }).then(function (response) {
        // get only date from date and time
        var date = response.list[i].dt_txt.split(" ").shift();
        var futureIcon = response.list[i].weather[0].icon;
        var futureTemp =
          Math.round((response.list[i].main.temp - 273.15) * 1.8 + 32) +
          " \u00B0F";
        var futureHumid = response.list[i].main.humidity + "%";
        $(`t${i}`).html(`<strong>${date}</strong>`);
      });
    }
  });
});
