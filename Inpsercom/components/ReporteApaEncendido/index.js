
app.reporteApaEnce = kendo.observable({
    onShow: function () {
        try {
            $("#NoOrdenAE1").text(datos_Cliente.nombre_alias + ": " + datos_Vehiculo.numeroorden);
            colorAE.push(["#c0392b"]);
            colorAE.push(["#1f618d"]);
            colorAE.push(["#f1c40f"]);
            colorAE.push(["#27ae60"]);
            colorAE.push(["#1c2833"]);
            colorAE.push(["#2e86c1"]);
            colorAE.push(["#a04000"]);
            colorAE.push(["#e74c3c"]);
            colorAE.push(["#99a3a4"]);
            colorAE.push(["#186a3b"]);
            //initMapAE();

            llamarPT();
        } catch (e) {
            mens("Error inicio docuemnto", "mens");
        }
        
    },
    afterShow: function () { },
    inicializa: function () { }
});
app.localization.registerView('reporteApaEnce');

function llamarPT() {
    kendo.ui.progress($("#reporteApaEnceScreen"), true);
    setTimeout(function () {
        initMapRA();
        //initMapAE();
        //initMap();
        //initialize();
    }, 2000);
}
function regresoAPAE() {
    try {
        //lineas.setMap(null);
        //marker.setMap(null);
        //marker = [];
        document.getElementById("mapapen").innerHTML = "";
        kendo.mobile.application.navigate("components/ReporteApaEncendidoPuntos/view.html");
    } catch (e) {
        mens("Error no cerro bien el mapa","mens")

    }
    
}
//var lineas;
//var marker;
var infoWindow;
var mapAE;
//var nombre = [];
var colorAE = [];
//var beachesAE = [];
//var beachesAEF = [];

function initMapRA() {
    try {
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var directionsService = new google.maps.DirectionsService;
        var height = (screen.height * 25.46875) / 100;
        var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
        document.getElementById("mapapen").style.height = height1 + "px";
        mapAE = new google.maps.Map(document.getElementById('mapapen'), {
            zoom: 14,
            center: { lat: parseFloat(registroAE1.LatitudInicial), lng: registroAE1.LongitudInicial },
            mapTypeId: google.maps.MapTypeId.SATELLITE
        });
        directionsDisplay.setMap(mapAE);
        calculateAndDisplayRouteAPE(directionsService, directionsDisplay);
       //document.getElementById('mode').addEventListener('change', function() {
        //calculateAndDisplayRoute(directionsService, directionsDisplay);
        //});
    } catch (e) {
        mens("Ocurrio un error al crear el mapa","mens"); kendo.ui.progress($("#reporteApaEnceScreen"), false);
    }

    kendo.ui.progress($("#reporteApaEnceScreen"), false);
}

function traercoordenadasHistorico(registroHi) {
    var ordenUsuario = datos_Vehiculo.numeroorden;
    var registroAux = JSON.parse(localStorage.getItem("registro_AE"));
    var fechaI = registroAux[0].FechaInicial.substr(0, 10);
    var fechaF = registroAux[0].FechaFinal.substr(0, 10);
    fechaI = fechaI.replace('/', '-');
    fechaF = fechaF.replace('/', '-');
    fechaI = fechaI.replace('/', '-');
    fechaF = fechaF.replace('/', '-');
    if (registroHi.FechaInicial.substr(0, 5).substr(4, 1) == ":") {
        var horaI = registroHi.FechaInicial.substr(0, 4).replace(':', '_');
    }
    else {
        var horaI = registroHi.FechaInicial.substr(0, 5).replace(':', '_');
    }
    if (registroHi.FechaFinal.substr(0, 5).substr(4, 1) == ":") {
        var horaF = registroHi.FechaFinal.substr(0, 4).replace(':', '_');
    }
    else {
        var horaF = registroHi.FechaFinal.substr(0, 5).replace(':', '_');
    }
    var Url = urlsherlocH + fechaI + " " + horaI + "/" + fechaI + " " + horaF; // + "?orden=" + ordenUsuario;
    var recorhisto;
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
                recorhisto = data.HistoricoResult;
            } catch (e) {
                mens("Error coordenadas servicio sherloc", "mens"); kendo.ui.progress($("#reporteApaEnceScreen"), false); return;
            }
        },
        error: function (err) {
            mens("Error servicio sherloc", "mens"); kendo.ui.progress($("#reporteApaEnceScreen"), false); return;
        }
    });
    return recorhisto;
}

function calculateAndDisplayRouteAPE(directionsService, directionsDisplay) {
    try {
        var registros1 = traercoordenadasHistorico(registroAE1);
        if (registros1.message != "") {
            mens(registros.message, "mens");
            kendo.ui.progress($("#reporteApaEnceScreen"), false);
            return;
        } else {
            var registros = registros1.lstHistorico[0].lstCoordenadas;
        }
        var len = registros.length;
        var factor = 1;
        var lalatlng = [];
        if (len - 2 > varPuntosMapa) {
            factor = Math.round((len - 2) / varPuntosMapa);
        }
        for (var n = factor; n <= len - 2; n++) {
            lalatlng.push({
                location: parseFloat(registros[n].Latitud) + "," + parseFloat(registros[n].Longitud),
                stopover: true
            })
            if (lalatlng.length == varPuntosMapa) {
                break;
            }
            n = n + factor - 1;
          }
        var selectedMode = "DRIVING"; //document.getElementById('mode').value;
        directionsService.route({
            origin: { lat: parseFloat(registros[0].Latitud), lng: parseFloat(registros[0].Longitud) },  // Haight.
            destination: { lat: parseFloat(registros[len - 1].Latitud), lng: parseFloat(registros[len - 1].Longitud) },  // Ocean Beach.
            waypoints: lalatlng,
            travelMode: google.maps.TravelMode[selectedMode]
        }, function (response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                mens('Respuesta a direcciones fallo ' + status, "mens"); return;
            }
        });
    } catch (e1) {
        mens("Error al cargar el mapa","mens"); kendo.ui.progress($("#reporteApaEnceScreen"), false);
    }
    return;
}

function closeInfoWindow() {
    infoWindow.close();
}

//function initialize() {
//    var map;
//    marker="";
//    lineas="";
//    var ruta = [];
//    var myLatLng;
//    var myOptions;
//    var height = (screen.height * 25.46875) / 100;
//    var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
//    document.getElementById("mapapen").style.height = height1 + "px";
//    var registros1 = traercoordenadasHistorico(registroAE1);
//    if (registros1.message != "") {
//        mens(registros.message, "mens");
//        kendo.ui.progress($("#reporteApaEnceScreen"), false);
//        return;
//    } else {
//        var registros = registros1.lstHistorico[0].lstCoordenadas;
//    }
//    myOptions = {
//        center: new google.maps.LatLng(parseFloat(registros[0].Latitud), parseFloat(registros[0].Longitud)),
//        zoom: 14,
//        mapTypeId: google.maps.MapTypeId.terrain
//    };
//    map = new google.maps.Map(document.getElementById("mapapen"), myOptions);
//    for (var i = 0; i < registros.length; i++) {
//        ruta.push(new google.maps.LatLng(parseFloat(registros[i].Latitud), parseFloat(registros[i].Longitud)));
//        marker = new google.maps.Marker({
//            map: map,
//            draggable: false,
//            icon: 'resources/icy_road.png',
//            animation: google.maps.Animation.DROP,
//            position: { lat: parseFloat(registros[i].Latitud), lng: parseFloat(registros[i].Longitud) }
//        });
//    }
    
//    lineas = new google.maps.Polyline({
//        path: ruta,
//        map: map,
//        strokeColor: '#222000',
//        strokeWeight: 4,
//        strokeOpacity: 0.6,
//        clickable: false
//    });
    
//    kendo.ui.progress($("#reporteApaEnceScreen"), false);
//}

//function setMarkersAE(mapE) {
//    try {
//        beachesAE = [];
//        var tama = registros.length;
//        var factor = 0;
//        if (tama > 15) { factor = Math.trunc((tama - 2) / 15); }
//        for (var i = 0; i < registros.length; i++) {
//            beachesAE.push([parseFloat(registros[i].Latitud), parseFloat(registros[i].Longitud), registros[i].Fecha]);
//        }
//        var image = {
//            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
//            size: new google.maps.Size(20, 32),
//            origin: new google.maps.Point(0, 0),
//            anchor: new google.maps.Point(0, 32)
//        };
//        var shape = {
//            coords: [1, 1, 1, 20, 18, 20, 18, 1],
//            type: 'poly'
//        };
//        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
//        for (var j = 0; j < beachesAE.length; j++) {
//            var beach = beachesAE[j];
//            var marker = new google.maps.Marker({
//                position: { lat: beach[0], lng: beach[1] },
//                map: mapE,
//                icon: 'resources/icy_road.png',
//                shape: shape,
//                nombre: "marcado" + j
//            });
//            google.maps.event.addListener(marker, 'click', (function (marker, j) {
//                return function () {
//                    infowindow = new google.maps.InfoWindow({
//                        content: '<div style="text-align:center;">' +
//                        '<b>Fecha y Hora </b><br/>' +
//                            beachesE[j][3] +
//                        '</div>'
//                    });
//                    infowindow.open(mapE, marker);
//                }
//            })(marker, j));
//        }
//    } catch (e) { mens("Error en mapa", "mens"); return; }
//}

//function initMap() {
//    var height = (screen.height * 25.46875) / 100;
//    var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
//    document.getElementById("mapapen").style.height = height1 + "px";
//    var map = new google.maps.Map(document.getElementById('mapapen'), {
//        zoom: 14,
//        center: { lat: parseFloat(registroAE1.LatitudInicial), lng: parseFloat(registroAE1.LongitudInicial) },
//        mapTypeId: 'terrain'
//    });
    
//    var myLatLng = { lat: parseFloat(registroAE1.LatitudInicial), lng: parseFloat(registroAE1.LongitudInicial) };
//    var marker = new google.maps.Marker({
//        position: myLatLng,
//        //color: green,
//        map: map
//    });
//    marker = new google.maps.Marker({
//        map: map,
//        draggable: true,
//        animation: google.maps.Animation.DROP,
//        position: { lat: parseFloat(registroAE1.LatitudFinal), lng: parseFloat(registroAE1.LongitudFinal) }
//    });
//    //marker.addListener('click', toggleBounce);
//    //myLatLng = { lat: parseFloat(registroAE1.LatitudFinal), lng: parseFloat(registroAE1.LongitudFinal) };
//    //marker = new google.maps.Marker({
//    //    position: myLatLng,
//    //    map: map
//    //});
//    // Define the LatLng coordinates for the polygon's path.
//    var triangleCoords = [
//     { lat: parseFloat(registroAE1.LatitudInicial), lng: parseFloat(registroAE1.LongitudInicial) },
//     { lat: parseFloat(registroAE1.LatitudFinal), lng: parseFloat(registroAE1.LongitudFinal) },
//    ];
//    // Construct the polygon.
//    var bermudaTriangle = new google.maps.Polyline({
//        path: triangleCoords
//    });
//    bermudaTriangle.setMap(map);
//    kendo.ui.progress($("#reporteApaEnceScreen"), false);
//}

//function initMapAE() {
//    var height = (screen.height * 25.46875) / 100;
//    var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
//    document.getElementById("mapapen").style.height = height1 + "px";
//    mapAE = new google.maps.Map(document.getElementById('mapapen'), {
//        zoom: 12,
//        center: { lat: parseFloat(registroAE1.LatitudInicial), lng: registroAE1.LongitudInicial },
//        mapTypeId: google.maps.MapTypeId.ROADMAP
//    });
//    google.maps.event.addListener(mapAE, 'click', function () {
//        closeInfoWindow();
//    });
//    mapAE.
//    setMarkersAE(mapAE);
//    rutasFR(mapAE);
//    kendo.ui.progress($("#reporteApaEnceScreen"), false);
//}

//function setMarkersAE(mapAE) {
//    try {
//        //contruccion marcas
//        beachesAE = [];

//        var registros = traercoordenadasHistorico(registroAE1);
//        var tama = registros.length;
//        if (tama > 15) { registroAE.lstRecorridos.length = 15; }
//        for (var i = 0; i < tama ; i++) {
//            beachesAE.push([parseFloat(registros[i].LatitudInicial), parseFloat(registros[i].LongitudInicial),
//            registroAE.lstRecorridos[i].KilometrajeInicial, registroAE.lstRecorridos[i].FechaInicial, registroAE.lstRecorridos[i].Recorrido]);

//            beachesAEF.push([parseFloat(registroAE.lstRecorridos[i].LatitudFinal), parseFloat(registroAE.lstRecorridos[i].LongitudFinal),
//            registroAE.lstRecorridos[i].KilometrajeFinal, registroAE.lstRecorridos[i].FechaFinal, registroAE.lstRecorridos[i].TiempoEncendido]);

//        }
//        var shape = {
//            coords: [1, 1, 1, 20, 18, 20, 18, 1],

//            type: 'poly'
//        };
//        for (var i = 0; i < beachesAE.length; i++) {
//            var beachAE = beachesAE[i];
//            var beachAEF = beachesAEF[i];
//            var markerAE = new google.maps.Marker({
//                position: { lat: beachAE[0], lng: beachAE[1] },
//                map: mapAE,
//                icon: 'resources/icy_road.png',
//                shape: shape,
//                nombre: "marcado" + i
//            });
//            var markerAEF = new google.maps.Marker({
//                position: { lat: beachAEF[0], lng: beachAEF[1] },
//                map: mapAE,
//                icon: 'resources/icy_road.png',
//                shape: shape,
//                nombre: "marcado" + i
//            });
//            google.maps.event.addListener(markerAE, 'click', (function (markerAE, i) {
//                return function () {
//                    infowindow = new google.maps.InfoWindow({
//                        content: '<div style="text-align:center;">' +
//                        '<b>Fecha y Hora Inicial </b><br/>' +
//                        beachesAE[i][3] +
//                        '<p><b>Kilometraje Inicial</b></p>' +
//                        '<p>' + beachesAE[i][2] + ' KM</p>' +
//                        '<p><b>Recorrido</b></p>' +
//                        '<p>' + beachesAE[i][4] + ' </p>' +
//                        '</div>'
//                    });
//                    infowindow.open(mapAE, markerAE);
//                }
//            })(markerAE, i));
//            google.maps.event.addListener(markerAEF, 'click', (function (markerAEF, i) {
//                return function () {
//                    infowindow = new google.maps.InfoWindow({
//                        content: '<div style="text-align:center;">' +
//                        '<b>Fecha y Hora Final </b><br/>' +
//                        beachesAEF[i][3] +
//                        '<p><b>Kilometraje Final</b></p>' +
//                        '<p>' + beachesAEF[i][2] + ' KM</p>' +
//                        '<p><b>Tiempo Encendido</b></p>' +
//                        '<p>' + beachesAEF[i][4] + ' </p>' +
//                        '</div>'
//                    });
//                    infowindow.open(mapAE, markerAEF);
//                }
//            })(markerAEF, i));
//        }
//    } catch (e) { mens("error al cargar marcas en el mapa", "mens"); kendo.ui.progress($("#reporteApaEnceScreen"), false); }
//}

//function rutasFR(mapAE) {
//    var registroHistorico = traercoordenadasHistorico(registroAE1);
//    for (var h = 0; h < registroAE.lstRecorridos.length; h++) {
//        var ruta = [
//            new google.maps.LatLng(registroAE.lstRecorridos[h].LatitudInicial, registroAE.lstRecorridos[h].LongitudInicial),
//            new google.maps.LatLng(registroAE.lstRecorridos[h].LatitudFinal, registroAE.lstRecorridos[h].LongitudFinal)
//        ];
//        var lineas = new google.maps.Polyline({
//            path: ruta,
//            map: mapAE,
//            strokeColor: colorAE[h],
//            strokeWeight: 4,
//            strokeOpacity: 0.6,
//            clickable: false
//        });
//    }
//}

