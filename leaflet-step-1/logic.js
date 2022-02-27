var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
  
  features(data.features);

});

function features(earthquakes) {

  function colour(feature) {
    
    var depth = feature.geometry.coordinates[2];
    var colourChoice = "#7a0177";

    if      (depth >100 ) {colourChoice = "#ae017e"}
    else if (depth > 80 ) {colourChoice = "#dd3497"}
    else if (depth > 60 ) {colourChoice = "#f768a1"}
    else if (depth > 40 ) {colourChoice = "#fa9fb5"}
    else if (depth > 20 ) {colourChoice = "#fcc5c0"}
    else if (depth > 0  ) {colourChoice = "#fde0dd"} 
    return(colourChoice)

  }

  function markerRadius(mag) {
    return mag * 3
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h4> ${feature.properties.place} </h4><hr><p> Magnitude: ${(feature.properties.mag)}<br>Depth: ${(feature.geometry.coordinates[2])}`);
  }

  function pointToLayer (feature, latlng) {
    return new L.CircleMarker ( latlng, 
                                { radius      : markerRadius(feature.properties.mag),
                                  color       : "#2f4f4f",
                                  fillColor   : colour(feature),
                                  fillOpacity : 0.8,
                                  weight      : 1.2
                                }
                              );
  }

  var earthquakeInfo = L.geoJSON(earthquakes, {
    pointToLayer : pointToLayer,
    onEachFeature: onEachFeature
  });

  createMap(earthquakeInfo);
}

// create function for map creation
function createMap (earthquakes) {
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    var baseMaps = {
      "Street Map": streetmap
    };

    var overlayMaps = {
      "Earthquakes": earthquakes
    };

    var myMap = L.map("map", {
      center: [40.1, -121.2],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}

// can't get the legend to work??

var colourList = ["#ae017e", "#dd3497", "#f768a1", "#fa9fb5", "#fcc5c0", "#fde0dd"];

var legend = L.control({ position: "bottomright" });
legend.onAdd = function () {

  var div = L.DomUtil.create("div", "legend");
  label = ["<strong>Depth</strong>"];
  bins = ["100+", "80 - 100", "60 - 80", "40 - 60", "20 - 40", "0 - 20"];
  div.innerHTML ='';
  for (var i = 0; i < bins.length; i++) {
        div.innerHTML +=
        label.push(
          '<i class="circle" style="background:' + colourList[i] + '">' + bins[i] + '"></i> ' + (bins[i] ? bins[i] : '+'));
        }
  }
  div.innerHTML = label.join('<br>');
  
  legend.addTo(myMap);

