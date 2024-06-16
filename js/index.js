const apiKey = "64d3d18315ea494984281128241406";
const searchInput = document.querySelector("#search");
let row = document.querySelector("#dataRow");

async function getWeatherData(city) {
    console.log(city);
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`);

    if (response.ok && response.status != 400) {
        const result = await response.json();

        await displayData(result);
    }
}

function displayData(result){
    let cityName = result.location?.name;
    let forecastday = result.forecast?.forecastday;

    let bBox = `<div class="text-center">
                    <h3>${cityName == undefined ? "No City Founded" : cityName}</h3>
                </div>`;

    for (let i = 0; i < forecastday?.length; i++) {
        if (i==1) {
            bBox += `  
                    <div class="col-md-4 d-flex flex-column text-center bg-2 text-white px-0">
                        <div class= "d-flex justify-content-between align-items-center bg-3 w-100 px-2">
                             <p>${forecastday[i].date}</p>
                             <p>${getDayName(forecastday[i].date)}</p>
                        </div>
                        <div class="align-self-center w-100 py-3">
                            <p>${forecastday[i].day.avgtemp_c} <sup>o</sup>C</p>
                            <p>Sunny</p>
                            <img src="https:${forecastday[i].day.condition.icon}" class="w-25"></img>
                            <div class="d-flex">
                            </div>
                        </div>
                    </div>`
        }
        else{
            bBox += `  
            <div class="col-md-4 d-flex flex-column text-center bg text-white px-0">
                <div class= "d-flex justify-content-between align-items-center bg-4 w-100 px-2">
                     <p>${forecastday[i].date}</p>
                     <p>${getDayName(forecastday[i].date)}</p>
                </div>
                <div class="align-self-center w-100 py-3">
                    <p>${forecastday[i].day.avgtemp_c} <sup>o</sup>C</p>
                    <p>Sunny</p>
                    <img src="https:${forecastday[i].day.condition.icon}" class="w-25"></img>
                    <div class="d-flex">
                    </div>
                </div>
            </div>`
        }
    }

    row.innerHTML = bBox;

}

function getDayName(dateString){
    const date = new Date(dateString);
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayName = weekDays[date.getDay()];
    return dayName;
}

searchInput.addEventListener("keyup" , async function() {
    const city = await getCityName(this);
    getWeatherData(city);
})

async function getCityName(cityName) {
    console.log(cityName.value);
    let response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName.value}`);
    const result = await response.json();

    const name = result[0]?.name;

    console.log(name);

    return name;
}

if ("geolocation" in navigator) {
    console.log("Available");
  } else {
    console.log("not Available");
  }

  getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('location-info').textContent = "Geolocation is not supported by this browser.";
    }
}

async function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=73e2b65d3dde4638916e77e3414bd920`);
        const data = await response.json();
        const city = data.results[0].components.city;

        getWeatherData(city);
    } catch (error) {
        console.error('Error fetching the city:', error);
        document.getElementById('location-info').textContent = "Unable to retrieve city information.";
    }
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('location-info').textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('location-info').textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('location-info').textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('location-info').textContent = "An unknown error occurred.";
            break;
    }
}

