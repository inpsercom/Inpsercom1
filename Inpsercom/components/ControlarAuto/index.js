//'use strict';
var directionsDisplay;
var directionsService;
var map2, geocoder;
app.mntControlVehiculo = kendo.observable({
    onShow: function () {
            var mensa = "Fecha: " + FechaRec;
            $("#recorrido").text(mensa);
            //Calculo el % a restar al alto total de la pantalla para que el mapa se ajuste correctamente al 100%
            llamarrecorrido();
    },
    afterShow: function () { },
    inicializa: function () {

    }
});
app.localization.registerView('mntControlVehiculo');
function llamarrecorrido() {
    kendo.ui.progress($("#mntControlVehiculoScreen"), true);
    setTimeout(function () {
        //initMapAA();
        mapareco();
    }, 2000);
}
function mapareco() {
    try {
    var height = (screen.height * 25.46875) / 100;
    var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
    document.getElementById("mapA").style.height = height1 + "px";
    var cords = traeCordenadas();
    var len = cords.length - 1;
    if (!cords || len == -1) { mens("No existe datos","mens"); return; }
    var latuno = parseFloat(cords[0].Latitud);
    var lnguno = parseFloat(cords[0].Longitud);
    var latfin = parseFloat(cords[len].Latitud);
    var lngfin = parseFloat(cords[len].Longitud);
    var latlng = [];
    var PosVehi = { lat: latuno, lng: lnguno };
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    map2 = new google.maps.Map(document.getElementById('mapA'), {
        zoom: 16,
        center: PosVehi

    });

    directionsDisplay.setMap(map2);
    geocoder = new google.maps.Geocoder;
    var factor = 1;
    if (len -2 > varPuntosMapa) { factor = Math.round((len - 2) / varPuntosMapa); }
            
    var bandera = 1;
    /*for (var n = len; n < len - 9; n--) {
        latlng.push({
            location: parseFloat(cords[n].Latitud) + "," + parseFloat(cords[n].Longitud),
            stopover: true
        })*/
    for (var n = factor; n <= len -2; n++ ) {
        latlng.push({
            location: parseFloat(cords[n].Latitud) + "," + parseFloat(cords[n].Longitud),
            stopover: true
        })
        if (latlng.length == varPuntosMapa) {
            break;
        }
        n = n + factor -1;
    }
    calculateAndDisplayRoute2(directionsService, directionsDisplay, latuno, lnguno, latlng, latfin, lngfin);
    
} catch (f) {
    mens("Error en servicio Sherloc", "mens"); kendo.ui.progress($("#mntControlVehiculoScreen"), false); return;
}
    kendo.ui.progress($("#mntControlVehiculoScreen"), false);
}
function traeCordenadas() {
    try {
        var cords;
        var ordenUsuario = datos_Vehiculo.numeroorden; //sessionStorage.getItem("Orden");
        //var Url = "http://190.110.193.131/ServiceERM.svc/Historico/04-04-2017/05-04-2017?" + ordenUsuario; + fecha + "/" + fecha + "?"
        var Url = urlsherlocH + FechaRec + "/" + FechaRec; // + "?" + ordenUsuario;
        var params = {
            orden: ordenUsuario,
            output: "json"
        };
        $.ajax({
            url: Url,
            type: "GET",
            data: params,
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cords = data.HistoricoResult.lstHistorico[0].lstCoordenadas;

                } catch (e) { mens("Error en Base de Sherloc", "mens"); kendo.ui.progress($("#mntControlVehiculoScreen"), false); return; }
            },
            error: function (err) { mens("Error en servicio Sherloc", "mens"); kendo.ui.progress($("#mntControlVehiculoScreen"), false); return; } //alert(JSON.stringify("error conexion err"+err)); }
        });
        return (cords);
    } catch (d) { mens("Error en servicio Sherloc", "mens"); kendo.ui.progress($("#mntControlVehiculoScreen"), false); return; }
}

function calculateAndDisplayRoute2(directionsService, directionsDisplay, lat1, long1, puntosInt, lat2, long2) {
    try {
        //var ppp = puntosInt.length;
        //alert(ppp);
        var selectedMode = "DRIVING";
        var request = {
            origin: { lat: lat1, lng: long1 },
            destination: { lat: lat2, lng: long2 },
            waypoints: puntosInt,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            } else {
                mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                     "ERROR", "<span align='justify'>" + 'Se ha producido un error en la solicitud de: ' + status + "</b></span>", true, true);
                return;
            }
        });
    } catch (k) {
        mens("Error al cargar el mapa", "mens"); kendo.ui.progress($("#mntControlVehiculoScreen"), false); return;
    }
}

//---------------------------------
function initMapAA() {
    try {
        var height = (screen.height * 25.46875) / 100;
        var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
        document.getElementById("mapA").style.height = height1 + "px";
        var cords = traeCordenadas();
        var len = cords.length - 1;
        if (!cords || len == -1) { mens("No existe datos", "mens"); return; }
        var latuno = parseFloat(cords[0].Latitud);
        var lnguno = parseFloat(cords[0].Longitud);
        var latfin = parseFloat(cords[len].Latitud);
        var lngfin = parseFloat(cords[len].Longitud);
        var latlng = [];
        var PosVehi = { lat: latuno, lng: lnguno };
        m = 1;
        for (var n = 1; n < len-1; n++) {
            latlng.push({
                location: parseFloat(cords[n].Latitud) + "," + parseFloat(cords[n].Longitud),
                stopover: true
            })
            if (m == varPuntosMapa) {
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                var map = new google.maps.Map(document.getElementById('mapA'), {
                    zoom: 16,
                    center: PosVehi
                });
                directionsDisplay.setMap(map);
                calculateAndDisplayRoutePRU(directionsService, directionsDisplay, latuno, lnguno, latlng, latfin, lngfin);
                latlng = null;
            } else {
                m += 1;
            }
            
        }
        
    } catch (e) {
        
        kendo.ui.progress($("#mntControlVehiculoScreen"), false);
    }
    
    kendo.ui.progress($("#mntControlVehiculoScreen"), false);
    
}

function calculateAndDisplayRoutePRU(directionsService, directionsDisplay, lat1, long1, puntosInt, lat2, long2) {
    try {
        //var waypts = puntosInt;
        //var checkboxArray = document.getElementById('waypoints');
        //for (var i = 0; i < checkboxArray.length; i++) {
        //    if (checkboxArray.options[i].selected) {
        //        waypts.push({
        //            location: checkboxArray[i].value,
        //            stopover: true
        //        });
        //    }
        //}
        directionsService.route({
            origin: { lat: lat1, lng: long1 },
            destination: { lat: lat2, lng: long2 },
            waypoints: puntosInt,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var summaryPanel = "";//document.getElementById('directions-panel');
                summaryPanel.innerHTML = '';
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                    var routeSegment = i + 1;
                    summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                        '</b><br>';
                    summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                    summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                    summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                }
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        kendo.ui.progress($("#mntControlVehiculoScreen"), false);
    } catch (e) {
        kendo.ui.progress($("#mntControlVehiculoScreen"), false);
    }
    kendo.ui.progress($("#mntControlVehiculoScreen"), false);
}
