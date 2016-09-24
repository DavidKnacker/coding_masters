var mymap = L.map('mapid').setView([26.73,-80.5454275], 15);
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
    url: "/getAllCoordinates",
    type: "get", //send it through get method
    data:{},
    success: function(response) {
      var points = JSON.parse(response)
      console.log(points)
      colors = {}
      for (i in points) {
        if (!colors[points[i].field_id])
          colors[points[i].field_id] = "#" + Math.random().toString(16).slice(2,8);
        var circle = L.circle([points[i].y, points[i].x], 20, {
          color: colors[points[i].field_id],
          fillColor: colors[points[i].field_id],
          fillOpacity: 1
        }).addTo(mymap);
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
      var machines = JSON.parse(response)
      console.log(machines)
      colors = {}
      for (i in machines) {
        var marker = L.marker([machines[i].y, machines[i].x]).addTo(mymap);
      }
    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });
}
