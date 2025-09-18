const x = document.getElementById("userLocation");
let lat = 39.7684;
let lon = -86.1581;

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.watchPosition(success, error);
  } 
  else{
    x.innerHTML = "Geolocation is not supported by this browser. Using default latitude and longitude";
  }
}

function success(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    x.innerHTML = "Latitude: " + lat +
                "<br>Longitude: " + lon;

    m_AstrosphericEmbed.Create("astrosphericChart", lat, lon);

    fetch(`/moon?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        console.log("Moon API response:", data); 
        if (data.data && data.data.imageUrl) {
          const imgUrl = data.data.imageUrl;
          document.getElementById("moonPhase").innerHTML =
            `<img src="${imgUrl}" alt="Moon Phase">`;
        } else {
          document.getElementById("moonPhase").innerText = "No moon data available.";
        }
      })
      .catch(err => console.error(err));
}

function error(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}

getLocation();

