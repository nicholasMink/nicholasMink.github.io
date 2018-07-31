const dogSection = document.querySelector('.dog-data');
const dogInput = document.querySelector('#dog-search');
const dogData = [];
let dogs = [];
let map;

let installPromptEvent;

getAllDogs();

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPromptEvent = event; // Stash the event so it can be triggered later.
  document.querySelector('#install-button').disabled = false; // Update the install UI to notify the user app can be installed
});


/**
 * Get all dog data from https://data.austintexas.gov/resource/h8x4-nvyi.json
 */
function getAllDogs() {

  $.ajax({
    url: "https://data.austintexas.gov/resource/h8x4-nvyi.json",
    type: "GET",
    data: {
      "$limit" : 100000,
    }
  })
  .done(function(data) {
    dogData.push(...data);
    initMap();
    createDogElements(data);
    mapControl(data);
  });
}

const register = () => {

  if ('serviceWorker' in navigator) {
    registerServiceWorker();
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('../sw.js').then(function(registration) {
        if (!navigator.serviceWorker.controller) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          return;
        } else {
          console.log('Service worker controller in Navigator')
        }
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
  
  function registerServiceWorker() {
    if (!navigator.serviceWorker) return;
      navigator.serviceWorker.register('/agnostic/sw.js', {
        scope: './'
      }).then(() => {
            console.log('Service worker has been successfully registered.');
      }).catch((err) => {
            console.log('error' , err);
      });
  };
}

/**
 * Google map init centered @ Austin, TX
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2972, lng: -97.7431},
    zoom: 10
  });
}

const setMapMarkers = (lat, long, markerTip, first, last, address) => {
  const content = `<h3>${markerTip}</h3><h4>Owner - ${first} ${last}</h4><p>${address}</p>`;
  var infowindow = new google.maps.InfoWindow({
    content: content
  });

  var latLng = new google.maps.LatLng(lat, long);
  // var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: markerTip,
    icon: '../agnostic/img/dog-marker.svg', // adjust for local development
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  register();

}

let mapControl = (mapData) => {
  // console.table(mapData);
  if (mapData.length < 3) {
    setSingleMarker(mapData[0].location.coordinates[1], mapData[0].location.coordinates[0], mapData[0].first_name, mapData[0].last_name, mapData[0].address + ' ' + mapData[0].zip_code);
  } else {
    mapData.forEach(dog => {
      if (dog.location) {
        setMapMarkers(dog.location.coordinates[1], dog.location.coordinates[0], dog.description_of_dog, dog.first_name, dog.last_name, dog.address + ' ' + dog.zip_code);
      }
    });
  }
} /* End of map */

/**
 * Search Dangerous Dogs
 */
let dogContent;
let searchParam;
let dogInfo = [];

dogInput.addEventListener('click', () => {
  dogContent = document.querySelectorAll('.dog-card-content');
  storeDogContent(dogContent);
});


dogInput.addEventListener('keyup', displayMatches);
dogInput.addEventListener('change', displayMatches);
const searchSuggestions = document.querySelector('.suggestions');

const storeDogContent = (content) => {
  content.forEach(dog => {
    dogInfo.push(dog.children[0]);
  })
}

function displayMatches( ) {

  const matchArray = findMatches(this.value, dogInfo);

  if (this.value.length < 1 || matchArray.length === 0) {
    searchSuggestions.style.display = 'none';
  } else {
    searchSuggestions.style.display = 'block';
  }

  const html = matchArray.map(descr => {
    let address = descr.nextElementSibling.childNodes[0].data;
    // console.log('matchArray:', matchArray)
    let queryAddress = address.substring(0, address.length - 8);
    queryAddress = queryAddress.split(' ');
    queryAddress = queryAddress.join('%20');
    // console.log('address', queryAddress, 'descr:', descr);

    return `
    <li tabindex="0" onclick="getDog('${queryAddress}')">
        <span id="${queryAddress}" class="dog-result">${descr.firstChild.data}</span>
      </li>
      `;
    }).join('');
    
    searchSuggestions.innerHTML = html;
  }

  function findMatches(searchParam) {
    return dogInfo.filter(dog => {
      const regex = new RegExp(searchParam, 'gi');
      return dog.innerText.match(regex) 
    });
} // End of search


let viewButtons;

/**
 * Creates all dog card elements
 */
const createDogElements = (data) => {
  data.forEach(dog => {
    // console.log(dog);
    let btnId = dog.address.split(' ');
    btnId = btnId.join('%20');
    dogSection.innerHTML += `
    <div class="dog-card">
      <div class="dog-card-content">
        <p>${dog.description_of_dog}</p>
        <p>${dog.address} - ${dog.zip_code}</p>
        <p>Owner: ${dog.first_name} ${dog.last_name}</p>
      </div>
      <div class="dog-card-button">
        <button id="${btnId}" onclick="getDog('${btnId}')">View Location</button>
      </div>
    </div>`;
  });

  viewButtons = document.querySelectorAll('button.dog-card--button');
  
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let clickedCard = btn.parentNode.parentNode;
      let clickedContent = clickedCard.querySelectorAll('.dog-card-content > p')
      let clickedAddress = clickedContent[1].innerText.split(' ');
      clickedAddress.pop();
      clickedAddress.pop();
      let urlParam = clickedAddress.join('%20').concat('%20');
      console.log('btn clicked', clickedCard, urlParam);
    });
  })
}

/**
 * 
 * Create single dog card element
 * 
 */

const createViewDog = (data) => {
  data.forEach(dog => {
    dogSection.innerHTML = '';
    let btnId = dog.address.split(' ');
    btnId = btnId.join('%20');
    dogSection.innerHTML += `
    <div class="dog-card">
      <div class="dog-card-content">
      <p>${dog.description_of_dog}</p>
      <p>${dog.address} - ${dog.zip_code}</p>
        <p>Owner: ${dog.first_name} ${dog.last_name}</p>
        </div>
        <div class="dog-card-button">
        <button onclick="getAllDogs()">Show All Dogs</button>
        </div>
        </div>`;
      });
    }
    
/**
 * Get single dog data from https://data.austintexas.gov/resource/h8x4-nvyi.json?address= + dog's registered address
 */
function getDog(addressQuery) {
  dogInput.value = '';
  console.log(addressQuery);
  searchSuggestions.style.display = 'none';
  const url = 'https://data.austintexas.gov/resource/h8x4-nvyi.json?address=' + addressQuery;
  // const showDogLocations = document.querySelector('.overview').parentElement;
  // console.log(showDogLocations);
  // let showDogButton = document.createElement('button');
  // // showDogButton.innerText = 'Show All';
  // // showDogButton.className = 'dog-all-button';
  
  // // showDogLocations.appendChild(showDogButton);
  
  $.ajax({
    url: url,
    type: "GET",
      data: {
        // "$limit" : 100000,
      }
    })
    .done(function(data) {
      console.log(...data);
      initMap();
      setSingleMarker(data[0].location.coordinates[1], data[0].location.coordinates[0], data[0].description_of_dog, data[0].first_name, data[0].last_name, data[0].address + ' ' + data[0].zip_code);
      // mapControl(data);
      /** 
       * TODO:
       * Bug - createViewDog shows a single dog with same address
       *      Fix querying by address to something safer
      */
      // createViewDog(data);
  });
  window.scroll({
    top: 0,
    behavior: "smooth"
  });
}

const setSingleMarker = (lat, long, first, last, address) => {
  const content = `<h3>Owner - ${first} ${last}</h3><h4>${address}</h4>`;
  var infowindow = new google.maps.InfoWindow({
    content: content
  });

  var latLng = new google.maps.LatLng(lat, long);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: address,
    animation: google.maps.Animation.DROP
  });

  marker.setAnimation(google.maps.Animation.BOUNCE);
  infowindow.open(map, marker);

}
