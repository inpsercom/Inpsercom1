//'use strict';
//document.getElementById('mymodal_cargar').style.display = "block";
var diip;
app.mntRegistroVin = kendo.observable({
    onShow: function () {
        try {
            kendo.ui.progress($("#mntRegistroVinScreen"), true);
            setTimeout(function () {
            }, 2000);
            var dp = "";
            diip = "";
            // $("#NumeroChasisPF").text(datos_Cliente.chasis);
            //RRP: alias - agregarvin
            $("#NumeroChasisPF").text(datos_Cliente.nombre_alias);
            //$('a.embed').gdocsViewer();
            //$('#embedURL').gdocsViewer();
            //alert(device.platform.toLowerCase());
            //loadPdf("http://200.31.10.92:8092/ASIAU_02_02_201707413.pdf");
            document.getElementById("logoPR").style.display = "none";
            var alto = screen.height - 160;
            var ancho = screen.width - 10;
            //alert(alto + "  " + ancho);
            //var todo = document.getElementById("ifmPrefactura");
            
            datos_Cliente = JSON.parse(localStorage.getItem("Inp_DatosUsuario"));
            var dips = TraerDireccion();
            diip = urlPdfExterno + dips[0].path_prefactura;
            if (diip == null || diip == "" || dips[0].path_prefactura == "") {
                document.getElementById("pdfPRE").setAttribute('style', 'display: none');
                mens("Documento Prefactura No Disponible", "mens")
                document.getElementById("ifmPrefactura").src = dp;
                document.getElementById("ifmPrefactura").setAttribute('style', 'display: none');
                document.getElementById("logoPR").setAttribute('style', 'display: block');
                kendo.ui.progress($("#mntRegistroVinScreen"), false);
                return;
            } else {
                document.getElementById("ifmPrefactura").setAttribute('style', 'display: block');
                document.getElementById("ifmPrefactura").style.width = ancho + "px";
                document.getElementById("ifmPrefactura").style.height = alto + "px";
                //var diip = "http://186.71.68.154:8090/prefactura_taller/DEBITOCONFIAMED2015.pdf";
                dp = "https://docs.google.com/viewer?url=" + diip + "&embedded=true";
                document.getElementById("ifmPrefactura").src = dp;
                document.getElementById("pdfPRE").setAttribute('style', 'display: block');
                datos_Cliente.path_prefactura = dips[0].path_prefactura;
                datos_Cliente.mail_cajero = dips[0].mail_cajero;
                datos_Cliente.codigo_consecionario = dips[0].codigo_concesionario;
                kendo.ui.progress($("#mntRegistroVinScreen"), false);
            }
            
        } catch (e) {
            mens("No se pudo cargar correctamente la prefactura", "mens");
        }
        kendo.ui.progress($("#mntRegistroVinScreen"), false);
        
    },
    afterShow: function () {
        //kendo.ui.progress($("#btnPDF"), false); 
    },
    inicializa: function () { }
});
app.localization.registerView('mntRegistroVin');
function llamarprefacturaEN() {
    kendo.ui.progress($("#mntRegistroVinScreen"), true);
    setTimeout(function () {
        prefacEn();
    }, 2000);
}

function prefacEn() {
    try {
        var diips = datos_Cliente.path_prefactura.toString();      
        for (var i = 0; i < diips.length; i++) {
            diips = diips.replace(':', '!');
            diips = diips.replace('/', '-');
        }
        if (datos_Cliente.mail_cajero == "" || datos_Cliente.mail_cajero == null) {
            mens("No existe mail para cajero de: " + datos_Cliente.codigo_consecionario, "mens");
            kendo.ui.progress($("#mntRegistroVinScreen"), false); return;
        }
        documento = "9;" + datos_Cliente.mail + ";;;" + datos_Cliente.mail_cajero;
        var envio = AceptaMailPRE(documento);
        if (envio.substring(0, 1) == "0") {
            mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
             "ERROR", "<span align='justify'>" + envio.substring(2, envio.length - 1) + "</b></span>", true, true);
            kendo.ui.progress($("#mntRegistroVinScreen"), false);
            return;
        }
        mens("La Prefactura fue aceptada con exito", "mens"); kendo.ui.progress($("#mntRegistroVinScreen"), false); return;
    } catch (e) {
        mens("Error en prefactura", "mens");
        kendo.ui.progress($("#mntRegistroVinScreen"), false); return;
    }
    kendo.ui.progress($("#mntRegistroVinScreen"), false);
}
function AceptaMailPRE(documento) {
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
                        borraCampos(); kendo.ui.progress($("#mntRegistroVinScreen"), false); return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens");
                    kendo.ui.progress($("#mntRegistroVinScreen"), false); return;

                }
            });
            kendo.ui.progress($("#mntRegistroVinScreen"), false);
            return resultado;
        }
    } catch (f) {
        mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#mntRegistroVinScreen"), false); return;
    }
    kendo.ui.progress($("#mntRegistroVinScreen"), false);
}

function prefac() {
    kendo.mobile.application.navigate("components/EnvioPrefactura/view.html");
}
function TraerDireccion() {
    try {
        //var usu = localStorage.getItem("Inp_DatosUsuario");
        var Url = urlService + "Ordenes/" + "5,2," + datos_Cliente.chasis;
        var infor;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infor = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;
                } catch (e) {
                    mens("No existe datos para esta cosnulta", "mens"); kendo.ui.progress($("#mntRegistroVinScreen"), false); return;
                }
            },
            error: function (err) {
                mens("No existe datos para esta cosnulta", "mens"); kendo.ui.progress($("#mntRegistroVinScreen"), false); return;
            }
        });
        return infor;
    } catch (e) { mens("Error en conexi" + String.fromCharCode(243) + "n con servicio", "mens"); kendo.ui.progress($("#mntRegistroVinScreen"), false); return; }
}
