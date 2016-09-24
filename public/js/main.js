var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
        ' Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1Ijoic3F1cmUwbmUiLCJhIjoiY2ltM2JjNmQ0MDBvendmbTZmbTJzbGJ6YiJ9.Dq495m3TpwbbAVfIMVISyg'
}).addTo(mymap);
