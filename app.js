let locationSaved = JSON.parse(localStorage.getItem('savedLocations2')); // fetch location from localstorage
console.log('LOCATION SAVED', locationSaved)

// Submit Form
let searchForm = document.getElementById("searchForm")
searchForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let location = document.getElementById("location");
    if (location.value == "") {
        alert("Make sure you input the valid city")
    } else {
        console.log(`Input is ${location.value}`);
        fetchWeatherInfo(location.value)
        fetchNewsInfo(location.value)
        location.value = "";
    }
})

// Weather API
let startingCity = "Vancouver"

const fetchWeatherInfo = async (q) => {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=0cbb4f3edf554cfd8c102809233011&q=${q}&days=7&aqi=no&alerts=no`)
    const data = await response.json()
    // console.log(data.forecast.forecastday)

    let cityHeader = document.getElementById("cityName")
    let cityText = `${data.location.name}, ${data.location.country}`
    cityHeader.innerText = cityText;
    let cityMainInto = document.getElementById('mainCityInfo');
    let cityInfo = `
<img src=${data.current.condition.icon}></img>
<h4>${data.current.condition.text}</h4>
<p>Temperature: ${data.current.temp_c} °C / ${data.current.temp_f} °F</p>
<p>Last updated: ${data.current.last_updated}</p>
`;
    cityMainInto.innerHTML = cityInfo;

    let otherDays = document.getElementById('daysInfo');
    let otherDaysInfo = "";
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayArray = data.forecast.forecastday
    dayArray.forEach(day => {
        otherDaysInfo += `
    <div>
    <h6>${weekday[new Date(day.date).getDay()]}</h6>
    <img src=${day.day.condition.icon}></img>
    <h6>${day.day.condition.text}</h6>
    <p>High: ${day.day.maxtemp_c} °C </p>
    <p>Low: ${day.day.mintemp_c} °C </p>
    </div>
    `
    })
    otherDays.innerHTML = otherDaysInfo;
    let city = document.getElementById('city')
    city.innerText = data.location.name

    // change background
    const rainy = ['Moderate or heavy rain with thunder', 'Patchy light rain with thunder', 'Moderate or heavy sleet showers', 'Light sleet showers', 'Torrential rain shower', 'Moderate or heavy rain shower', 'Light rain shower', 'Moderate or heavy freezing rain', 'Light freezing rain', 'Heavy rain', 'Heavy rain at times', 'Moderate rain', 'Moderate rain at times', 'Light rain', 'Patchy light rain', 'Heavy freezing drizzle', 'Freezing drizzle', 'Light drizzle', 'Patchy light drizzle', 'Thundery outbreaks possible', 'Patchy freezing drizzle possible', 'Patchy sleet possible', 'Patchy rain possible']
    const snow = ['Patchy light snow with thunder', 'Moderate or heavy snow with thunder', 'Moderate or heavy showers of ice pellets', 'Light showers of ice pellets', 'Moderate or heavy snow showers', 'Light snow showers', 'Ice pellets', 'Heavy snow', 'Patchy heavy snow', 'Moderate snow', 'Patchy moderate snow', 'Light snow', 'Patchy light snow', 'Moderate or heavy sleet', 'Light sleet', 'Blizzard', 'Blowing snow', 'Patchy snow possible']
    const cloudy = ['Freezing fog', 'Fog', 'Mist', 'Overcast', 'Cloudy']
    const sunny = ['Partly cloudy', 'Sunny']
    const night = ['Clear']

    if (rainy.includes(data.current.condition.text)) {
        document.body.style.background = `url('./images/rainy.jpeg')`;
    } else if (snow.includes(data.current.condition.text)) {
        document.body.style.background = `url('./images/snowy.jpeg')`;
    } else if (cloudy.includes(data.current.condition.text)) {
        document.body.style.background = `url('./images/cloudy.jpeg')`;
    } else if (sunny.includes(data.current.condition.text)) {
        document.body.style.background = `url('./images/Sunny.jpeg')`;
    } else if (night.includes(data.current.condition.text)) {
        document.body.style.background = `url('./images/clear.jpeg')`;
    }

    if (savedArray.includes(`${data.location.name}, ${data.location.country}`)) {
        star.setAttribute("style", "color: #fbd513;")
    } else {
        star.removeAttribute("style")
    }

}

// click star to save and add div to save locations
let star = document.getElementById('starUnclicked')
let savedCitiesDiv = document.getElementById('savedCity')
let savedArray;
if (locationSaved) {
    savedArray = locationSaved;
} else {
    savedArray = []
}
console.log(locationSaved)
let savedCityInfo = "";
star.addEventListener("click", () => {
    if (star.hasAttribute("style")) {
        star.removeAttribute("style")
        let index = savedArray.indexOf(document.getElementById('cityName').innerText)
        if (index > -1) {
            console.log(savedArray)
            savedArray.splice(index, 1)
            console.log('CURRENT', savedArray)
            const cityDivToRemove = Array.from(savedCitiesDiv.children).find(div => div.textContent.includes(document.getElementById('cityName').innerText));
            if (cityDivToRemove) {
                savedCitiesDiv.removeChild(cityDivToRemove);
            }
        }
    } else {
        star.setAttribute("style", "color: #fbd513;")
        if (!savedArray.includes(document.getElementById('cityName').innerText)) {
            savedArray.push(document.getElementById('cityName').innerText)
            console.log(savedArray)
            const newCityDiv = document.createElement('div');
            newCityDiv.addEventListener('click', () => {
                const clickedCityName = newCityDiv.querySelector('p').innerText;
                console.log(clickedCityName)
                fetchNewsInfo(clickedCityName);
                fetchWeatherInfo(clickedCityName);
            })
            newCityDiv.setAttribute('id', 'clickable')
            newCityDiv.innerHTML = `<p> 📍 ${document.getElementById('cityName').innerText}</p>`;
            savedCitiesDiv.appendChild(newCityDiv);
            localStorage.setItem('savedLocations2', JSON.stringify(savedArray)); // save to localstorage
            console.log(localStorage.getItem('savedLocations1'))
        }
    }

    console.log('SAVED', savedArray)
}
)

// create save divs from the saved locations
if (locationSaved) {
    locationSaved.forEach(location => {
        const newCityDiv = document.createElement('div');
        newCityDiv.addEventListener('click', async () => {
            const clickedCityName = await newCityDiv.querySelector('p').innerText;
            fetchNewsInfo(clickedCityName);
            fetchWeatherInfo(clickedCityName);
        })
        newCityDiv.setAttribute('id', 'clickable')
        newCityDiv.innerHTML = `<p> 📍 ${location} </p>`;
        savedCitiesDiv.appendChild(newCityDiv);
    })
}


const fetchNewsInfo = async (q) => {
    // const response = await fetch(`https://newsdata.io/api/1/news?apikey=pub_3377267e6fd4be84dd17de35c040850122f62&qInTitle=${q}`)
    const response = await fetch(`https://newsapi.org/v2/everything?q=${q}&apiKey=7d95bdd18ae1419284f83a1d21df6a93`)
    // const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${q}&apiKey=6cb9b484f65443d59b51ccacecc5e1bc`)
    const data = await response.json()
    // console.log(data)

    //main news
    const mainNews = document.getElementById('mainNews');
    let mainNewsInfo = `
    <img src=${data.articles[0].urlToImage}></img>
    <div><h6><a href=${data.articles[0].url} target=_blank>${data.articles[0].title}</a></h6>
    <p>${data.articles[0].description}</p>
<a href=${data.articles[0].url} target=_blank id='read'>Read</a>
<div>
`
    mainNews.innerHTML = mainNewsInfo;

    // others news
    const otherNews = document.getElementById('otherNews');
    let otherNewsInfo = "";
    for (let i = 1; i <= 4; i++) {
        otherNewsInfo += `
    <div class="otherNewsDiv">
    <p>${data.articles[i].title}</p>
    <a href=${data.articles[i].url} target=_blank>Read</a>
</div>
`
    }
    otherNews.innerHTML = otherNewsInfo;

}

fetchWeatherInfo(startingCity)
fetchNewsInfo(startingCity)