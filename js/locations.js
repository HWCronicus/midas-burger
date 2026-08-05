let map;
let markers = [];
let infoWindow;
let mapBounds;

const locations = [
  {
    title: "Midas Burger - Atlantic",
    address: "9890 Hutchinson Park Dr, Jacksonville, FL 32225",
    lat: 30.34293,
    lng: -81.52044,
  },
  {
    title: "Midas Burger - Southside Commons",
    address: "8808 Beach Blvd, Jacksonville, FL 32216",
    lat: 30.28822,
    lng: -81.54711,
  },
  {
    title: "Midas Burger - Northgate Landing",
    address: "13227 City Square Dr, Jacksonville, FL 32218",
    lat: 30.50562,
    lng: -81.63185,
  },
];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 30.3789, lng: -81.5664 },
  });

  infoWindow = new google.maps.InfoWindow();
  mapBounds = new google.maps.LatLngBounds();

  locations.forEach((loc, index) => {
    const position = { lat: loc.lat, lng: loc.lng };

    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: loc.title,
    });

    marker.addListener("click", () => {
      openInfoWindow(marker, loc);
    });

    markers.push(marker);
    mapBounds.extend(position);
  });

  map.fitBounds(mapBounds);
}

function openInfoWindow(marker, loc) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address)}`;
  infoWindow.setContent(`
        <div class="info-window">
          <div class="info-window-title">${loc.title}</div>
          <div class="info-window-address">${loc.address}</div>
          <a
            class="info-window-directions"
            href="${directionsUrl}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get directions to ${loc.title}"
          >
            Directions
          </a>
        </div>
    `);
  infoWindow.open(map, marker);
}

function updateActiveLocation(index) {
  const locationLinks = document.querySelectorAll(".location-link");

  locationLinks.forEach((link, linkIndex) => {
    link.classList.toggle("is-active", linkIndex === index);
  });
}

function focusLocation(index) {
  const loc = locations[index];
  const marker = markers[index];

  map.panTo({ lat: loc.lat, lng: loc.lng });
  map.setZoom(16);
  updateActiveLocation(index);

  openInfoWindow(marker, loc);
}

function resetMapView() {
  infoWindow.close();
  map.fitBounds(mapBounds);
  updateActiveLocation(-1);
}
