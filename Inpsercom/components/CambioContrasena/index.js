
app.cambioC = kendo.observable({
    onShow: function () { document.getElementById("passwordAnt").value = ""; },
    afterShow: function () { }
});
app.localization.registerView('cambioC');
function llamarcambioC() {
    kendo.ui.progress($("#cambioCScreen"), true);
    setTimeout(function () {
        grabarCCT();
    }, 2000);
}
function grabarCCT() {
    try{
        if (document.getElementById("emailCambio").value != "") {
            if (document.getElementById("passwordAnt").value != "") {
                if (document.getElementById("passwordNew").value != "") {
                    if (document.getElementById("RpasswordNew").value != "") {
                        if (document.getElementById("RpasswordNew").value == document.getElementById("passwordNew").value) {
                            var respuesta = cambioContrasena();
                            if (respuesta.substring(0, 1) == "0") {
                                mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='120' height='26' src='resources/Kia-logo.png'>",
                                 "ERROR", "<span align='justify'>" + respuesta.substring(2, respuesta.length) + "</b></span>", true, true);
                                kendo.ui.progress($("#cambioCScreen"), false);
                            }
                            else {
                                mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='120' height='26' src='resources/Kia-logo.png'>",
                                  "ALERTA", "<span align='justify'>" + respuesta.substring(2, respuesta.length) + "</b></span>", true, true);
                                document.getElementById("emailCambio").value = "";
                                document.getElementById("passwordAnt").value = "";
                                document.getElementById("passwordNew").value = "";
                                document.getElementById("RpasswordNew").value = ""
                                localStorage.removeItem("Inp_DatosUsuario");
                                localStorage.removeItem("Inp_DatosVehiculo");
                                /*datos_Cliente = null;
                                datos_Vehiculo = null;
                                localStorage.setItem("Inp_DatosUsuario", datos_Cliente);
                                localStorage.setItem("Inp_DatosVehiculo", datos_Vehiculo);
                                datos_Cliente = JSON.parse(localStorage.getItem("Inp_DatosUsuario"));
                                datos_Vehiculo = JSON.parse(localStorage.getItem("Inp_DatosVehiculo"));*/
                                navigator.app.exitApp();
                                kendo.ui.progress($("#cambioCScreen"), false);
                                //kendo.mobile.application.navigate("components/logIn/view.html");
                            }
                        } else {
                            mens("Password nuevo y confirmaci" + String.fromCharCode(243) + "n password", "mens");
                            mens("Son diferentes", "mens"); kendo.ui.progress($("#cambioCScreen"), false);
                        }
                    } else {
                        mens("Confirmaci" + String.fromCharCode(243) + "n password esta en blanco", "mens"); kendo.ui.progress($("#cambioCScreen"), false);
                    }
                } else {
                    mens("Nuevo password esta en blanco", "mens"); kendo.ui.progress($("#cambioCScreen"), false);
                }
            } else {
                mens("Password anterior esta en blanco", "mens"); kendo.ui.progress($("#cambioCScreen"), false);
            }
        } else {
            mens("Email esta en blanco", "mens"); kendo.ui.progress($("#cambioCScreen"), false);
        }
    } catch (e) {mens("Error en cambio de clave", "mens"); kendo.ui.progress($("#cambioCScreen"), false); }
    kendo.ui.progress($("#cambioCScreen"), false);
}

function cambioContrasena() {
    var respCambio;
    try {  //mail;;;;pasword_ant;password_new;
        var Url = urlService + "CambioContrasena/" + document.getElementById("emailCambio").value + ";;;;" + document.getElementById("passwordAnt").value + ";" + document.getElementById("passwordNew").value;
       $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    respCambio = data.CambioContrasenaGetResult;
                } catch (e) {
                    mens("Error en servicio cambio clave", "mens"); kendo.ui.progress($("#cambioCScreen"), false); return;
                }
            },
            error: function (err) { 
                mens("Error en cambio clave", "mens"); kendo.ui.progress($("#cambioCScreen"), false); return;//alert(JSON.stringify(err));
            }
        });
    } catch (e) {
        kendo.ui.progress($("#cambioCScreen"), false);
    }
    kendo.ui.progress($("#cambioCScreen"), false);
    return respCambio;
}

function ValidaMailCambio() {
    try {
        if (document.getElementById("emailCambio").value != "") {
            var result = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(document.getElementById("emailCambio").value);
            if (result == false) {
                document.getElementById("emailCambio").style.borderColor = "red";
            } else {
                document.getElementById("emailCambio").style.borderColor = "";
                document.getElementById("passwordAnt").focus();
            }
        }
    } catch (f) {
        mens("Error validaci" + String.fromCharCode(243) + "n del mail", "mens"); return;
    }
}
