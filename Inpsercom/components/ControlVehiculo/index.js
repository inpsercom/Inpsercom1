//'use strict';

app.miKia4 = kendo.observable({
    onShow: function() {$("#NoOrdenDB").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);},
    afterShow: function() {},
});
app.localization.registerView('miKia4');

function regresar(){
    if (datos_Vehiculo.tipoContratoSherloc == "GOLDEN") {
        kendo.mobile.application.navigate("components/OrdenInstalacion/view.html");
    } else { kendo.mobile.application.navigate("components/OrdenInstalacionBasico/view.html"); }
}

function llamarapertura() {
    kendo.ui.progress($("#miKia4Screen"), true);
    setTimeout(function () {
        if (datos_sherloc.apertura == "SI") {
            aperturaRemota();
        } else {
            mens("Cliente no tiene activo el servicio", "mens");
            terminaC();
        }
    }, 2000);
}
function terminaC() {
    kendo.ui.progress($("#miKia4Screen"), false);
}
function llamardesbloqueo() {
    kendo.ui.progress($("#miKia4Screen"), true);
    setTimeout(function () {
        if (datos_sherloc.desbloqueo == "SI") {
            desbloqueAuto();
        } else {
            mens("Cliente no tiene activo el servicio", "mens");
            terminaC();
        }
    }, 2000);
}

function llamarbloqueo() {
    kendo.ui.progress($("#miKia4Screen"), true);
    setTimeout(function () {
        if (datos_sherloc.bloqueo == "SI") {
            bloqueAuto();
        } else {
            mens("Cliente no tiene activo el servicio", "mens");
            terminaC();
        }
    }, 2000);
}

function aperturaRemota(){
    try {
        //NoOrden = 72353;
        if (NoOrden != "") {
            //mens("AUTO ABIERTO LAS PUERTAS","mens");
            //kendo.ui.progress($("#miKia2Screen"), true);
            //http://190.110.193.131/ClienteService.svc/ClientProfile/8LGJE5520CE010039/R/0992327685001/1234567890/0995545554?orden=72363
            //var Url = "http://190.110.193.131/ClienteService.svc/ClientProfile/" + datos_Cliente.chasis + "/R/" + datos_Cliente.identificacion_cliente + "/1234567890/" + datos_Cliente.telefono_celular;
            var Url = urlsherlocControl + "A?"; // + NoOrden;
            var params = {
                orden: NoOrden,
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
                        mens("AUTO ABIERTO LAS PUERTAS","mens");
                    } catch (e) {
                        mens("ERROR APERTURA DE PUERTAS INTENTELO NUEVAMENTE");
                        //alert(e);
                        //kendo.ui.progress($("#miKia2Screen"), false);
                    }
                },
                error: function (err) {
                    mens("ERROR DE CONEXION A SHERLOC INTENTELO NUEVAMENTE");
                    //alert(JSON.stringify(err));
                    //kendo.ui.progress($("#miKia2Screen"), false);  para poner protector pantalla
                }
            });
        }
    } catch (e) {
        mens("Error de servicios Sherloc", "mens"); kendo.ui.progress($("#miKia4Screen"), false); return;
    }
    kendo.ui.progress($("#miKia4Screen"), false);
}

function desbloqueAuto(){
    try {
        //NoOrden = 72353;
        if (NoOrden != "") {
            //mens("AUTO DESBLOQUEADO","mens");
            //kendo.ui.progress($("#miKia2Screen"), true);
            //http://190.110.193.131/ClienteService.svc/ClientProfile/8LGJE5520CE010039/R/0992327685001/1234567890/0995545554?orden=72363
            //var Url = "http://190.110.193.131/ClienteService.svc/ClientProfile/" + datos_Cliente.chasis + "/R/" + datos_Cliente.identificacion_cliente + "/1234567890/" + datos_Cliente.telefono_celular;
            var Url = urlsherlocControl + "D?"; // + NoOrden;
            var params = {
                orden: NoOrden,
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
                        mens("AUTO DESBLOQUEADO","mens");
                    } catch (e) {
                        mens("ERROR AL DESBLOQUEADO INTENTELO NUEVAMENTE");
                        //alert(e);
                        //kendo.ui.progress($("#miKia2Screen"), false);
                    }
                },
                error: function (err) {
                    mens("ERROR DE CONEXION A SHERLOC INTENTELO NUEVAMENTE");
                    //alert(JSON.stringify(err));
                    //kendo.ui.progress($("#miKia2Screen"), false);
                }
            });
        }
    } catch (e) {
        mens("Error de servicios Sherloc", "mens"); kendo.ui.progress($("#miKia4Screen"), false); return;
    }
    kendo.ui.progress($("#miKia4Screen"), false);
}

function bloqueAuto() {
    try {
        //NoOrden = 72353;
        if (NoOrden != "") {
           // mens("AUTO BLOQUEADO", "mens");
           //kendo.ui.progress($("#miKia2Screen"), true);
            //http://190.110.193.131/ClienteService.svc/ClientProfile/8LGJE5520CE010039/R/0992327685001/1234567890/0995545554?orden=72363
            //var Url = "http://190.110.193.131/ClienteService.svc/ClientProfile/" + datos_Cliente.chasis + "/R/" + datos_Cliente.identificacion_cliente + "/1234567890/" + datos_Cliente.telefono_celular;
            var Url = urlsherlocControl + "B?"; // + NoOrden;
            var params = {
                orden: NoOrden,
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
                        mens("AUTO BLOQUEADO", "mens");
                    } catch (e) {
                        mens("ERROR AL BLOQUEAR INTENTELO NUEVAMENTE");
                        //alert(e);
                        //kendo.ui.progress($("#miKia2Screen"), false);
                    }
                },
                error: function (err) {
                    mens("ERROR DE COMUNICACION CON SHERLOC, INTENTELO NUEVAMENTE");
                    //alert(JSON.stringify(err));
                    //kendo.ui.progress($("#miKia2Screen"), false);
                }
            });
        }
    } catch (e) {
        mens("Error de servicios Sherloc", "mens"); kendo.ui.progress($("#miKia4Screen"), false); return;
    }
    kendo.ui.progress($("#miKia4Screen"), false);
}