//'use strict';

app.reactivacionG = kendo.observable({
    onShow: function () {
        //$("#NumeroChasisGA").text(datos_Cliente.chasis);
        // RRP: alias - reactivaciongarantia
        $("#NumeroChasisGA").text(datos_Cliente.nombre_alias);
        
        //document.getElementById("recuperar_email").focus();
        //document.getElementById("recuperar_email").value = datos_Cliente.mail;
    },
    afterShow: function () { }
});
app.localization.registerView('reactivacionG');
function llamarmailG() {
    kendo.ui.progress($("#reactivacionGScreen"), true);
    setTimeout(function () {
        enviarMailG();
    }, 2000);
}
function enviarMailG() {
    var documento;
    try {
            documento = "10;" + datos_Cliente.mail + ";;;;;;" + datos_Cliente.chasis;
            var envio = EnvioMailGA(documento);
            if (envio.substring(0, 1) == "0") {
                mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                "ERROR", "<span align='justify'>" + envio.substring(2, envio.length - 2) + "</b></span>", true, true);
            }else{
                mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                "AVISO", "<span align='justify'>Muchas gracias por contactarse con nosotros, una persona del Departamento de Servicio a Cliente se comunicará con ud. Para generar la renovación de su garantía.</b></span>" , true);
            }
            kendo.mobile.application.navigate("components/EstadoMantenimiento/view.html");
    } catch (f) { mens("Error validacion mail", "mens"); kendo.ui.progress($("#reactivacionGScreen"), false); return; }
    kendo.ui.progress($("#reactivacionGScreen"), false);
}

function EnvioMailGA(documento) {
    try {
        if ((documento !== "") && (documento)) {
            var resultado = "";
            var Url = urlService + "EnvioMail/" + documento;
            //alert(Url);
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        resultado = data.EnvioMailGetResult;
                    } catch (e) {
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                     "ERROR", "<span align='justify'>" + data + "</b></span>", true, true);
                        borraCampos(); kendo.ui.progress($("#reactivacionGScreen"), false); return;
                    }
                },
                error: function (err) {
                    mens("Error conexion servicio Vehiculo", "mens"); kendo.ui.progress($("#reactivacionGScreen"), false);
                    return;
                }
            });
            kendo.ui.progress($("#reactivacionGScreen"), false);
            return resultado;
        }
    } catch (f) {
        mens("Error conexion servicio Vehiculo", "mens"); kendo.ui.progress($("#reactivacionGScreen"), false); return;
    }
    kendo.ui.progress($("#reactivacionGScreen"), false);
}