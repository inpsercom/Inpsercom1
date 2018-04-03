//11:30 -12:15
//'use strict';
var NoOrden;
app.miKia2 = kendo.observable({
    onShow: function () {
        try {
            //document.getElementById("NoOrdenn").value = "";
            kendo.ui.progress($("#miKia2Screen"), false);
            $("#NoOrden").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
            NoOrden = datos_Vehiculo.numeroorden;
            if (NoOrden == "") {
                kendo.ui.progress($("#btnHabilita"), true);
            }
        } catch (f) { mens("Error n" + String.fromCharCode(250) + "mero de orden", "mens"); return; }
    },
    afterShow: function () { },
    inicializa: function () {
        $("#btn_activar").kendoButton({
            click: function (e) { habilitarOpciones(); }
        });
        $("#ubicar").kendoButton({
            click: function (e) { ubicarVehiculo(); }
        });
        $("#control").kendoButton({
            click: function (e) { controlVehiculo(); }
        });
        $("#recorrer").kendoButton({
            click: function (e) { recorrerAuto(); }
        });
        $("#recorrer").kendoButton({
            click: function (e) { reporteAlertas(); }
        });
    }
});
app.localization.registerView('miKia2');

function ubicarVehiculo() {
    kendo.ui.progress($("#miKia2Screen"), true);
    setTimeout(function () {
        //alert(inspeccionar(datos_sherloc));
        if (datos_sherloc.ubicacion == "SI") {
            kendo.mobile.application.navigate("components/Ubicacion/view.html");
        } else {
            mens("Cliente no tiene activo el servicio", "mens");
            terminaU();
        }
        
    }, 2000);
        //kendo.mobile.application.navigate("components/ReporteExceso/view.html");
}
function terminaU() {
    kendo.ui.progress($("#miKia2Screen"), false);
}
function reporteAlertas() {
    kendo.ui.progress($("#miKia2Screen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/MenuAlertas/view.html");
    }, 2000);  
}
function recorrerAuto() {
    kendo.ui.progress($("#miKia2Screen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/FechaRecorrido/view.html");
    }, 2000);
    //kendo.mobile.application.navigate("components/ControlarAuto/view.html");
}

function controlVehiculo() {
    kendo.ui.progress($("#miKia2Screen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/ControlVehiculo/view.html");
    }, 2000);
}

function habilitarOpciones() {
    try { 
        var NoOrden1 = datos_Vehiculo.numeroorden; //document.getElementById("NoOrdenn").value;
        if (NoOrden1 != "") {
            var Url = urlsherlocMenu + datos_Cliente.chasis + "/R/" + datos_Cliente.identificacion_cliente + "/1234567890/" + datos_Cliente.telefono_celular;
            //var params = { orden: NoOrden1, output: "json" }; data: params,
            $.ajax({
                url: Url, type: "GET",  dataType: "json",async: false,
                success: function (data) {
                    try {
                        data1 = data.perfilClienteResult;
                        if (data1.estadoServicio == "A") {
                            var chasisemail = "3;" + datos_Cliente.mail + ";" + datos_Vehiculo.chasis + ";" + data1.orden;
                            var Url = urlService + "EliminaV";
                            var params = { "vin": chasisemail };
                            $.ajax({
                                url: Url, type: "POST", data: JSON.stringify(params), dataType: "json", //Content-Type: application/json
                                headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                                success: function (data) {
                                    try {
                                        if (data == "Success") {
                                            try {
                                                kendo.ui.progress($("#btnHabilita"), false);
                                                kendo.ui.progress($("#miKia2Screen"), false);
                                                datos_Vehiculo.estado_vh02 = true;
                                                datos_Vehiculo.numeroorden = data.orden
                                                //document.getElementById("NoOrdenn").value = "";
                                                $("#NoOrden").text(datos_Vehiculo.numeroorden);
                                                mens("Orden Guardada", "success");
                                            } catch (s) { mens("Error consulta sherloc","mens");return; }
                                        } else {mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                                            "Advertencia", "<span align='justify'>" + data + "</b></span>", true, true); return;
                                        }//kendo.ui.progress($("#miKia2Screen"), false);  }
                                    } catch (e) { mens("Error servicio sherloc","mens");return; }
                                },
                                error: function (err) {
                                    mens("Error conexi" + String.fromCharCode(243) + "n Sherloc", "mens"); return;
                                }
                            });
                        } else {
                            mens("Cliente no esta activo", "mens");
                            datos_Vehiculo.numeroorden = "";
                            datos_Vehiculo.estado_vh02 = false;
                            kendo.ui.progress($("#btnHabilita"), true);
                            //kendo.ui.progress($("#miKia2Screen"), false);
                            return;
                        }
                        document.getElementById("NoOrden").value = "";
                        localStorage.setItem("Inp_DatosVehiculo", JSON.stringify(datos_Vehiculo));
                        localStorage.setItem("Inp_DatosUsuario", JSON.stringify(datos_Cliente));
                        datos_Vehiculo = JSON.parse(localStorage.getItem("Inp_DatosVehiculo"));
                        datos_Cliente = JSON.parse(localStorage.getItem("Inp_DatosUsuario"));
                    } catch (e) {
                        mens("Error servicio Sherloc","mens");return;
                        //kendo.ui.progress($("#miKia2Screen"), false);
                    }
                },
                error: function (err) {
                    mens("Error servicio Sherloc","mens");return;
                    //kendo.ui.progress($("#miKia2Screen"), false);
                }
            });
        }
    } catch (e) {mens("Error servicio Sherloc","mens");return;}
}

function registra(chasisemail) {
    try {
        var Url = urlService + "EliminaV";
        var params = { "vin": chasisemail };
        $.ajax({
            url: Url, type: "POST", data: JSON.stringify(params), dataType: "json", //Content-Type: application/json
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            success: function (data) {
                if (data == "Success") {
                        try {
                            mens("Orden Guardada", "success");
                            return data;
                        } catch (s) { mens("Error al grabar orden","mens");return; }
                } else { mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                     "Advertencia", "<span align='justify'>" + data + "</b></span>", true, true); return;
                }
            },
            error: function (err) {
                mens("Error servicio grabar orden","mens");return;
            }
        });
    } catch (f) { mens("Error servicio grabar orden","mens");return; }
}
