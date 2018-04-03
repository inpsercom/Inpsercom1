//'use strict';

app.miKia = kendo.observable({
    init: function () { },
    onShow: function () {
        //$("#NumeroChasis").text(datos_Cliente.chasis);
        // RRP: alias - mikia
        kendo.ui.progress($("#miKiaScreen"), false);
        $("#NumeroChasis").text(datos_Cliente.nombre_alias);
       
// alert(inspeccionar(datos_Cliente)); //RRP

        var Registro = sessionStorage.getItem("Registro");
        kendo.ui.progress($("#miKiaScreen"), false);
    },
    afterShow: function () { }
});
app.localization.registerView('miKia');

function logout() {
    navigator.app.exitApp();
}

function AgregarVin() {
    kendo.ui.progress($("#miKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/AgregarVin/view.html");
    }, 2000);
    //kendo.mobile.application.navigate("pdf/pdfjs-dist-master/viewer.html");
}

function HistorialVin() {
    kendo.ui.progress($("#miKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/OrdenesTrabajo/view.html");
    }, 2000);
    //kendo.mobile.application.navigate("components/HistorialVin/view.html");
}

function OrdenTrabajo() {
    kendo.ui.progress($("#miKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/HistorialVin/view.html");
    }, 2000);
}

function estadoMan() {
    kendo.ui.progress($("#miKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/EstadoMantenimiento/view.html");
    }, 2000);
}

function citas() {
    try {
        var obtineCita = obtenCita(datos_Cliente.mail);
        if (obtineCita == "false" || obtineCita == "" || !obtineCita) {
            mens("No existe placa de este vehiculo", mens);
            return;
        }
        for (var i = 0; i < obtineCita.length; i++) {
           if (obtineCita[i].chasis == datos_Cliente.chasis) {
               var placa_cita = obtineCita[i].placa;
               var chasis = obtineCita[i].chasis;
                break;
            }
        }
    } catch (e) {
        mens("Error en consulta de placa","mens");
    }
    document.cookie = "nombre=cita; max-age=0";
    //http://citatallerkia.com.ec/cliente/reservar-cita?placa=PBR1470
    //document.getElementById("cita").href = urlCitas + "?placa=" + placa_cita;
    var paracita = "";
    if(chasis=="" || chasis==null){
        paracita = "?placa=" + placa_cita;
    }else{
         paracita = "?vin=" + chasis;
    }
    window.open(urlCitas + paracita, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
    //window.open("http://citatallerkia.com.ec/cliente/reservar-cita?placa=PBR1470", "http://citatallerkia.com.ec/cliente/reservar-cita?placa=PBR1470", "width=200, height=100");
    //window.plugins.childBrowser.showWebPage('http://citatallerkia.com.ec/cliente/reservar-cita?placa=PBR1470', { showLocationBar: true });
}

function colisiones() {
    try {
    var obtieneColision = obtenCita(datos_Cliente.mail);
    if (obtieneColision == "false" || obtieneColision == "" || !obtieneColision) {
        mens("No existe placa de este vehiculo", mens);
        return;
    }
    for (var i = 0; i < obtieneColision.length; i++) {
        if (obtieneColision[i].chasis == datos_Cliente.chasis) {
            var placa_Colision = obtieneColision[i].placa;
            break;
        }
    }
} catch (e) {
   mens("Error en consulta de colisiones","mens");
}
    //alert(placa_Colision);
    //document.getElementById("colisiones").href = urlColisiones + "&placa="+ placa_Colision;
    window.open(urlColisiones + "&placa=" + placa_Colision, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
}

function obtenCita(emailp) {
    try {
        if ((emailp !== "") && (emailp)) {
            var resultado = "";
            var Url = urlService + "Vehiculo/" + emailp;
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        resultado = JSON.parse(data.VehiculoGetResult).Vehiculo;
                    } catch (e) {
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                            "ERROR", "<span align='justify'>" + data + "</b></span>", true, true);
                        borraCamposLogin(); return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); return;

                }
            });
            return resultado;
        }
    } catch (f) {
        mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); return;
    }
}