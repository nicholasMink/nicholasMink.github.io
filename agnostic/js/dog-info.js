const dogSection = document.querySelector('.dog-data');
// const dogInput = document.querySelector('#dog-search');
const dogData = [];
let map;
let zip_code = 78660;
let last_name = 'Rafacz';
let streetNumber = '7400%20Espira%20Drive%20';

$.ajax({
  url: `https://data.austintexas.gov/resource/h8x4-nvyi.json?address=${streetNumber}`,
  type: "GET"
  })
  .done(function(data) {
    dogData.push(...data);
    createDogHtml(dogData);
    mapControl(dogData);
});

/**
 * Map for dogs
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2972, lng: -97.7431},
    zoom: 10
  });
}

let mapControl = (mapData) => {
  console.table(mapData[0])
  if (mapData[0].location.coordinates) {
    let ownerLast = mapData[0].last_name;
    let ownerName = mapData[0].first_name + mapData[0].last_name; 
    let address = `${mapData[0].address}, ${mapData[0].zip_code}`;
    setMarker(mapData[0].location.coordinates[1], mapData[0].location.coordinates[0], mapData[0].description_of_dog, ownerName, address);
  }
} /* End of map */

/**
 * Creates dog card elements
 */
const createDogHtml = (dogData) => {
  console.log(dogData[0].description_of_dog);
  dogSection.innerHTML += `
  <div class="dog-content">
    <h2>${dogData[0].description_of_dog}</h2>
    <p>Location: ${dogData[0].address}<br>Austin, TX ${dogData[0].zip_code}</p>
    <p>Owner: ${dogData[0].first_name} ${dogData[0].last_name}</p>
  </div>`;
}

const setMarker = (lat, long, markerTip, owner, address) => {
  const content = `<h3>${markerTip}</h3><h4>Owner - ${owner}</h4><p>${address}</p>`;
  var infowindow = new google.maps.InfoWindow({
    content: `<h3>${address}</h3>`
  });

  var latLng = new google.maps.LatLng(lat, long);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: dogData[0].description_of_dog,
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

}