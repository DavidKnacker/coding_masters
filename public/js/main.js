var mymap = L.map('mapid').setView([26.73,-80.5454275], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
        ' Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1Ijoic3F1cmUwbmUiLCJhIjoiY2ltM2JjNmQ0MDBvendmbTZmbTJzbGJ6YiJ9.Dq495m3TpwbbAVfIMVISyg'
}).addTo(mymap);

window.onload = function() {
  $.ajax({
    url: "/getCornerCoordinates",
    type: "get", //send it through get method
    data:{},
    success: function(response) {
      var points = JSON.parse(response)
      console.log(points)
      colors = {}
      for (i in points) {
        var polygon = L.polygon([
          [points[i].min_y, points[i].min_x],
          [points[i].min_y, points[i].max_x],
          [points[i].max_y, points[i].max_x],
          [points[i].max_y, points[i].min_x],
          [points[i].min_y, points[i].min_x]
        ]).addTo(mymap);
      }
    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });
  $.ajax({
    url: "/getCurrentMachines",
    type: "get", //send it through get method
    data:{},
    success: function(response) {
      var tractorIcon = L.icon({
          iconUrl: '/images/tractor.png',
          iconSize:     [25, 25], // size of the icon
          iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      var machines = JSON.parse(response)
      console.log(machines)
      colors = {}
      for (i in machines) {
        var marker = L.marker([machines[i].y, machines[i].x], {icon: tractorIcon}).addTo(mymap);
      }
    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });
}
