//'use strict';
var map, marker, color, icon;
app.miKia3 = kendo.observable({
    onShow: function () {
        try {
            $("#NoOrdenUB").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
            var cords = traeCordenadasUbica();
            if (cords.RespuestaComando == "Error") {
                mens(cords.errorDetail);
                return;
            }
            if (cords.Latitud == null) { mens("No existe datos", "mens"); return; }
            var PosVehi = { lat: parseFloat(cords.Latitud), lng: parseFloat(cords.Longitud) };
            //Calculo el % a restar al alto total de la pantalla para que el mapa se ajuste correctamente al 100%
            var height = (screen.height * 27.46875) / 100;
            var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra
            document.getElementById("map").style.height = height1 + "px";

            color = "red";
            if (cords.ApagadoEncendido == 0) {
                color = "black";
            }
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: PosVehi
            });
            icon = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: color,
                strokeWeight: 3,
                scale: 6,
                rotation: parseFloat(cords.Sentido)
            };
            marker = new google.maps.Marker({
                position: PosVehi,
                map: map,
                icon: icon,
                label: "Velocidad: " + cords.Velocidad + " KMpH"
            });
        } catch (s) {
            mens("Error servicio sherloc", "mens");
            return;
        }
    },
    afterShow: function () { }
});
app.localization.registerView('miKia3');
var intervalo;
function reload() {
    try {
        intervalo = window.setInterval(function () {
            reload2()
        }, 1000);

    } catch (f) {
        mens("Error servicio sherloc", "mens");
        return;
    }
}
function reload2() {
    try {
        var cords = traeCordenadasUbica();
        if (cords.RespestaComando == "Error") {
            mens(cords.errorDetail);
            return;
        }
        var PosVehi = new google.maps.LatLng(
            cords.Latitud,
            cords.Longitud
        );
        color = "red";

        if (cords.ApagadoEncendido == 0) {
            color = "black";
        }
        icon = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: color,
            strokeWeight: 3,
            scale: 6,
            rotation: parseFloat(cords.Sentido)
        };
        marker.setIcon(icon);
        marker.setLabel("Velocidad: " + cords.Velocidad + " KMpH");
        marker.setPosition(PosVehi);

        map.panTo(PosVehi);
        if (color == "black") {
            if (intervalo) {
                clearInterval(intervalo);
            }
        }
    } catch (f) {
        mens("Error servicio sherloc", "mens");
        return;
    }
}

function traeCordenadasUbica() {
    try {
        var cords;
        var ordenUsuario = datos_Vehiculo.numeroorden; //sessionStorage.getItem("Orden");
        var Url = urlsherlocControl + "U?" + ordenUsuario;
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
                    cords = data.EnviarMensajeResult;
                } catch (e) {
                    mens("Error coordenadas servicio sherloc", "mens");
                    return;
                }
            },
            error: function (err) {
                mens("Error servicio sherloc", "mens");
                return;
            }
        });
        return (cords);
    } catch (d) {
        mens("Error en servicio sherloc", "mens");
        return;
    }
}
function regreso() {
    if (datos_Vehiculo.tipoContratoSherloc == "GOLDEN") {
        kendo.mobile.application.navigate("components/OrdenInstalacion/view.html");
    } else { kendo.mobile.application.navigate("components/OrdenInstalacionBasico/view.html"); }
}