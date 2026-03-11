let btn = document.getElementById("btn");

btn.addEventListener("click", getWeather);

async function getWeather(){

let city = document.getElementById("city-input").value;

let apiKey = "a966312e16bdd47d55fbda1ec8e6a111";

let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

let response = await fetch(url);

let data = await response.json();

console.log(data); // debugging

// error handling
if(data.cod != 200){
alert("City not found or API problem");
return;
}

let temp = data.main.temp;
let desc = data.weather[0].description;

document.getElementById("temp").innerText = temp + " °C";
document.getElementById("desc").innerText = desc;

}