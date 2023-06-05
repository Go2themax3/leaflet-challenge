// Fetch the earthquake data from the USGS GeoJSON feed
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {

    const map = L.map('map').setView([0, 0], 2);

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define a function to calculate the color based on earthquake depth
    function getColor(depth) {
      if (depth > 90) {
        return "#d73027";
      } else if (depth > 70) {
        return "#fc8d59";
      } else if (depth > 50) {
        return "#fee08b";
      } else if (depth > 30) {
        return "#d9ef8b";
      } else if (depth > 10) {
        return "#91cf60";
      } else {
        return "#1a9850";
      }
    }

    // Create circle markers
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];

      // Create a circle marker at each earthquake location
      const circle = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: magnitude * 2,
        fillColor: getColor(depth),
        color: 'white',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });

      // Popup with additional information
      circle.bindPopup(`
        Location: ${feature.properties.place}<br>
        Magnitude: ${magnitude}<br>
        Depth: ${depth} km
      `);

      // Add the circle marker to the map
      circle.addTo(map);
    });

    // Create a legend
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [0, 10, 30, 50, 70, 90];
      const labels = [];

      // Loop through the depth intervals and generate a label with a colored square for each interval
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML += `
          <i style="background:${getColor(depths[i] + 1)}"></i>
          ${depths[i]}-${depths[i + 1]} km<br>
        `;
      }

      return div;
    };

    // Add the legend to the map
    legend.addTo(map);
  })
  .catch(error => {
    console.log('Error fetching earthquake data:', error);
  });
