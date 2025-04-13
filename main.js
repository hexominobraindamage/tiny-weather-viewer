const apiKey = "baba178d89889a8af358faaf02d7f0cc"; //just because i already have one
const locationFetch = document.querySelector(".get-location-auto");
const searchQuery = new URLSearchParams(location.search);
const query = searchQuery.get("q")?.trim();

const locationInput = document.querySelector("[get-location]");
const locationButton = document.querySelector("#searchBtn");
const refeshButton = document.querySelector(".refresh");

let lat, lon; // Declare global variables for latitude and longitude

let statecode = ""; // Declare statecode variable
let countrycode = ""; // Declare countrycode variable
locationInput.addEventListener("input", (e) => {
  const cityname = e.target.value.trim().toLowerCase();
  locationInput.value = cityname;
});
locationButton.addEventListener("click", () => {
  document.querySelector(".crystalize").classList.remove("hide");
  const cityname = locationInput.value.trim().toLowerCase();
  latlongFetch(cityname, statecode, countrycode).then(() => {
    getWeather(lat, lon); // Call getWeather only after latlongFetch resolves
  });
});

refeshButton.addEventListener("click", () => {
  document.querySelector(".crystalize").classList.remove("hide");
  locationInput.value = "";
  document.querySelector(".electro-charged").classList.add("hide");
  document.querySelector(".crystalize").classList.add("hide");
  document.querySelector(".refresh").classList.remove("hide");
  getWeather(lat, lon); // Call getWeather with the last known lat/lon, if there is none then we just hide this
});

locationFetch.addEventListener("click", () => {
    document.querySelector(".crystalize").classList.remove("hide");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      lat = position.coords.latitude; // Assign values to global variables
      lon = position.coords.longitude;
      console.log(lat, lon);// Call latlongFetch with the input value
      // Call getWeather with the fetched lat/lon
      getWeather(lat, lon);
    },
    (error) => {
      console.error("Error getting location:", error.message);
      document.querySelector(".crystalize").classList.add("hide");
      alert(
        "Unable to fetch location. PLease make sure you gave access to geolocation."
      );
    }
  );
});
function latlongFetch(cityname, statecode, countrycode) {
  const stateParam = statecode ? `,${statecode}` : "";
  const countryParam = countrycode ? `,${countrycode}` : "";
  document.querySelector(".crystalize").classList.remove("hide");
  return fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}${stateParam}${countryParam}&limit=5&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((latlong) => {
      if (latlong.length > 0) {
        lat = latlong[0].lat; // Assign latitude to global variable
        lon = latlong[0].lon; // Assign longitude to global variable
        console.log(`${lat} ${lon}`);
      } else {
        console.error("No results found for the provided city name.");
        alert("No results found for the provided city name. Please try again.");
        document.querySelector(".crystalize").classList.add("hide");
      }
    })
    .catch((error) => {
      console.error("Error fetching latitude and longitude:", error);
      alert("Error fetching location data. Please try again later.");
      document.querySelector(".crystalize").classList.add("hide");
    });
}


function getWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const weather = data.weather[0].description;
      const weatherIcon = data.weather[0].icon; // Weather icon code, will convert to actual icons
      document.querySelector(
        "#icon"
      ).src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      //either openweatherAPI is drunk or there is something wrong on my end, no way the temperatures are all the same
      const location = data.name;
      const temp = Math.round(data.main.temp);
      const tempmax = Math.round(data.main.temp_max);
      const tempmin = Math.round(data.main.temp_min);
      const realfeel = Math.round(data.main.feels_like);
      console.log()
      document.querySelector(".electro-charged").classList.remove("hide");
      document.querySelector("#locationName").textContent = location;
      document.querySelector("#condition").textContent = weather;
      document.querySelector("#temperature").textContent = `${temp}°C`; //because fuck imperial
      document.querySelector("#tempmaxmin").textContent =
        `${tempmax}°C` + " / " + `${tempmin}°C`;
      document.querySelector("#feelslike").textContent =
        "RealFeel: " + `${realfeel}°C`;
      document.querySelector(".crystalize").classList.add("hide");
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
  document.querySelector(".refresh").classList.remove("hide");
}
if (!locationInput.value) {
  document.querySelector(".electro-charged").classList.add("hide");
  document.querySelector(".crystalize").classList.add("hide");
  document.querySelector(".refresh").classList.add("hide");
}
