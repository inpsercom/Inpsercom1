app.reporteParada = kendo.observable({
    onShow: function () {$("#NoOrdenPA1").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
        llamarMapP();
    },
    afterShow: function () { },
    inicializa: function () { }
});
app.localization.registerView('reporteParada');
function llamarMapP() {
    kendo.ui.progress($("#reporteParadaScreen"), true);
    setTimeout(function () {
        initMapP();
    }, 2000);
}
// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.
var infoWindow;
var mapP;
var nombre = [];
function initMapP() {
    var height = (screen.height * 25.46875) / 100;
    var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
    document.getElementById("mappara").style.height = height1 + "px";
    mapP = new google.maps.Map(document.getElementById('mappara'), {
        zoom: 12,
        center: { lat: -0.1808764, lng: -78.48463070000002 }
    });
    //infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(mapP, 'click', function () {
        closeInfoWindow();
    });
    setMarkersP(mapP);
    kendo.ui.progress($("#reporteParadaScreen"), false);
}
/*function openInfoWindow(marker) {
    try {
        alert(inspeccionar(marker));
        var markerLatLng = marker.getPosition();
        infoWindow.setContent([
            '<div style="text-align:center;">',
            'Las coordenadas del <b>',

            '</b> son:<br/>',
            markerLatLng.lat(),
            ', ',
            markerLatLng.lng(),
            '<br/><br/>Arr&aacute;strame y haz click para actualizar la posici&oacute;n.',
            '<br/>O puedes hacer click en cualquier otro lado para cerrarme.',
            '</div>'
        ].join(''));
        infoWindow.open(mapE, marker);
    } catch (e) { alert(e); }
}
*/
// Data for the markers consisting of a name, a LatLng and a zIndex for the  //content,
// order in which these markers should display on top of each other.
var beachesP = [];
function closeInfoWindow() {
    infoWindow.close();
}
function setMarkersP(mapP) {
    try {
        beachesP = [];
        var tama = registroPA.lstAlarmas.length;
       // if (tama > 15) { registroPA.lstAlarmas.length = 15; }
        for (var i = 0; i < registroPA.lstAlarmas.length; i++) {
            beachesP.push([parseFloat(registroPA.lstAlarmas[i].Latitud), parseFloat(registroPA.lstAlarmas[i].Longitud), registroPA.lstAlarmas[i].Velocidad, registroPA.lstAlarmas[i].Fecha]);
        }
        
        // Adds markers to the map.

        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.

        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.  'http://190.108.66.10:8089/biss.sherloc/pickup.png'
        var image = {
            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            //'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],

            type: 'poly'
        };
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        /*var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: iconBase + 'parking_lot_maps.png'  'library_maps.png  'info-i_maps.png'
        });
        iconBase + 'parking_lot_maps.png'*/
        for (var i = 0; i < beachesP.length; i++) {
            var beachP = beachesP[i];
            var markerP = new google.maps.Marker({
                position: { lat: beachP[0], lng: beachP[1] },
                map: mapP,
                icon: 'resources/icy_road.png',
                shape: shape,
                nombre: "marcado" + i
            });
            google.maps.event.addListener(markerP, 'click', (function (markerP, i) {
                return function () {
                    infowindow = new google.maps.InfoWindow({
                        content: '<div style="text-align:center;">' +
                        '<b>Fecha y Hora </b><br/>' +
                            beachesP[i][3] +
                        '<p><b>Velocidad del vehículo</b></p>' +
                        '<p>' + beachesP[i][2] + ' KMPH</p>' +
                        '</div>'
                    });
                    infowindow.open(mapP, markerP);
                }
            })(markerP, i));
        }
    } catch (e) { mens("Error en mapa","mens");return;  }
}