const dogSection = document.querySelector('.dog-data');
const dogInput = document.querySelector('#dog-search');
const dogData = [];
let dogs = [];
let map;

$.ajax({
  url: "https://data.austintexas.gov/resource/h8x4-nvyi.json",
  type: "GET",
    data: {
      "$limit" : 100000,
    }
  })
  .done(function(data) {
    dogData.push(...data);
    createDogElements(data);
    mapControl(data);
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2972, lng: -97.7431},
    zoom: 10
  });
}

const setMapMarkers = (lat, long, markerTip, first, last) => {
  const content = `<h3>${markerTip}</h3><h4>Owner - ${first} ${last}</h4>`;
  var infowindow = new google.maps.InfoWindow({
    content: content
  });

  var latLng = new google.maps.LatLng(lat, long);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: content,
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

}

// console.log(dogs);
let mapControl = (mapData) => {
  // console.table(mapData)
  mapData.forEach(dog => {
    if (dog.location) {
      let lat = dog.location.coordinates[1];
      let long = dog.location.coordinates[0];
      let description = dog.description_of_dog;
      let ownerFirst = dog.first_name;
      let ownerLast = dog.last_name;
      setMapMarkers(lat, long, description, ownerFirst, ownerLast);
    }
  });
}

let dogContent;

dogInput.addEventListener('click', () => {
  dogContent = document.querySelectorAll('.dog-card-content');
  console.log(dogContent);
  storeDogContent(dogContent);
});

dogInput.addEventListener('keyup', () => {
  let searchParam = dogInput.value;
  console.log(searchParam);
});

const storeDogContent = (content) => {
  content.forEach(dog => {
    console.log(dog.children[0].innerText);
  })
}

/**
 * 
 * Creates dog card elements
 * 
 */
const createDogElements = (data) => {
  data.forEach(dog => {
    dogSection.innerHTML += `
      <div class="dog-card">
      <div class="dog-card-content">
      <p>${dog.description_of_dog}</p>
      <p>${dog.address}<br>Austin, TX ${dog.zip_code}</p>
      <p>Owner: ${dog.first_name} ${dog.last_name}</p>
      </div>
      <div class="dog-card-button">
      <button class="dog-card--button">View Location</button>
      </div>
      </div>`;
  });
}

// console.log('dogData:', dogData);

