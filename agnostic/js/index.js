const dogSection = document.querySelector('.dog-data');
const dogInput = document.querySelector('#dog-search');
const dogData = [];
let dogs = [];
let map;

let installPromptEvent;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPromptEvent = event; // Stash the event so it can be triggered later.
  document.querySelector('#install-button').disabled = false; // Update the install UI to notify the user app can be installed
});

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
    navigator.serviceWorker.register('/sw.js', {
      scope: './'
    }).then(() => {
          console.log('Service worker has been successfully registered.');
    }).catch((err) => {
          console.log('error' , err);
    });
};

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
    console.log(data)
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

const setMapMarkers = (lat, long, markerTip, first, last, address) => {
  const content = `<h3>${markerTip}</h3><h4>Owner - ${first} ${last}</h4><p>${address}</p>`;
  var infowindow = new google.maps.InfoWindow({
    content: content
  });

  var latLng = new google.maps.LatLng(lat, long);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: markerTip,
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

}

let mapControl = (mapData) => {
  // console.table(mapData)
  mapData.forEach(dog => {
    if (dog.location) {
      let lat = dog.location.coordinates[1];
      let long = dog.location.coordinates[0];
      let description = dog.description_of_dog;
      let ownerFirst = dog.first_name;
      let ownerLast = dog.last_name;
      let address = `${dog.address}, ${dog.zip_code}`;
      setMapMarkers(lat, long, description, ownerFirst, ownerLast, address);
    }
  });
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
  console.log(viewButtons);
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
    let queryAddress = address.substring(0, address.length - 7);
    queryAddress = queryAddress.split(' ');
    queryAddress = queryAddress.join('%20');
    // console.log('address', queryAddress);
    return `
      <li>
        <span id="${queryAddress}" class="dog-result" onclick="createDog()">${descr.firstChild.data}</span>
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

/**
 * Creates dog card elements
 */

let viewButtons;

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
 * Create single dog view
 * 
 */

function getDog(addressQuery) {
  console.log('https://data.austintexas.gov/resource/h8x4-nvyi.json' + addressQuery)
}

/**
 * dog.html views
 */

