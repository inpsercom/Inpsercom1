//'use strict';

app.envioPrefactura = kendo.observable({
    onShow: function () {
       // $("#NumeroChasisPR").text(datos_Cliente.chasis);

        // RRP: alias - envioprefactura
        $("#NumeroChasisPR").text(datos_Cliente.nombre_alias);
        
        document.getElementById("recuperar_emailPR").focus();
        document.getElementById("recuperar_emailPR").value = datos_Cliente.mail;
        //document.getElementById("cameraTakePicture").addEventListener("click", cameraTakePicture); 

    },
    afterShow: function () { }
});
app.localization.registerView('envioPrefactura');
/*function cameraGetPicture() {
   navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
   });

   function onSuccess(imageURL) {
      var image = document.getElementById('myImage');
      image.src = imageURL;
   }

   function onFail(message) {
      alert('Failed because: ' + message);
   }

}*/
function llamarmailPR() {
    kendo.ui.progress($("#envioPrefacturaScreen"), true);
    setTimeout(function () {
        enviarMailPR();
    }, 2000);
}

function enviarMailPR() {
    var documento;
    var _mail = document.getElementById("recuperar_emailPR").value;
    if ((_mail) && (_mail != "")) {
        try {
            if (document.getElementById("recuperar_emailPR").value != "") {
                var result = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(document.getElementById("recuperar_emailPR").value);
                if (result == false) {
                    document.getElementById("recuperar_emailPR").focus();
                    document.getElementById("recuperar_emailPR").style.borderColor = "red";
                } else {
                    var diips = datos_Cliente.path_prefactura.toString();
                    for(var i = 0; i < diips.length; i++){
                        diips = diips.replace(':','!');
                        diips = diips.replace('/','-');
                    }
                    documento = "7;" + datos_Cliente.mail + ";;" + diips + ";" + _mail;
                    var envio = EnvioMailPRE(documento);
                    if (envio.substring(0, 1) == "0") {
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                         "ERROR", "<span align='justify'>" + envio.substring(2, envio.length - 2) + "</b></span>", true, true);
                    }
                    mens("Prefactura enviada al correo especificado", "mens");
                    kendo.mobile.application.navigate("components/AgregarVin/view.html");
                }
            }
        } catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n mail", "mens"); kendo.ui.progress($("#envioPrefacturaScreen"), false); return; }
    }
    kendo.ui.progress($("#envioPrefacturaScreen"), false);
}

function EnvioMailPRE(documento) {
    try {
        if ((documento !== "") && (documento)) {
            var resultado = "";
            var Url = urlService + "EnvioMail/" + documento;
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
                        borraCampos(); kendo.ui.progress($("#envioPrefacturaScreen"), false); return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens");
                    kendo.ui.progress($("#envioPrefacturaScreen"), false);
                    return;
                }
            });
            return resultado;
        }
    } catch (f) {
        mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#envioPrefacturaScreen"), false); return;
    }
    kendo.ui.progress($("#envioPrefacturaScreen"), false);
}


