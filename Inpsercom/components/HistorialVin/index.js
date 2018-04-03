//'use strict';
var if1;
app.mntHistorialVin = kendo.observable({
    onShow: function () {
        //$("#NumeroChasisOTC").text(datos_Cliente.chasis);
        // RRP: alias - historialvin
        $("#NumeroChasisOTC").text(datos_Cliente.nombre_alias);

        document.getElementById("logo").style.display = "none";
        document.getElementById("gridMC").style.display = "none";
        document.getElementById("gridCL").style.display = "none";
        document.getElementById("histrialOT").style.display = "none";
        document.getElementById("historialOT1").style.display = "none";
        document.getElementById("colorRE").style.background = "#eaeaea";
        document.getElementById("colorTR").style.background = "#eaeaea";
        document.getElementById("colorLA").style.background = "#eaeaea";
        document.getElementById("colorCO").style.background = "#eaeaea";
        document.getElementById("colorPRO").style.background = "#eaeaea";
        document.getElementById("colorLVA").style.background = "#eaeaea";
        document.getElementById("colorCCC").style.background = "#eaeaea";
        document.getElementById("colorLT").style.background = "#eaeaea";
        ConsultarHV();
    },
    afterShow: function () { },
    inicializa: function () {

    }
});
app.localization.registerView('mntHistorialVin');

function ConsultarHV() {
    try {
        var usu = localStorage.getItem("Inp_DatosUsuario");
        //var Url = "http://200.31.10.92:8092/appk_aekia/Services/SL/Sherloc/Sherloc.svc/Ordenes/" + "4,2," + datos_Cliente.chasis;
        var Url = urlService + "Ordenes/" + "4,2," + datos_Cliente.chasis;
        var infor;
        var infor1 = [];
        var infor2 = [];
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (data.OrdenesGetResult == null) {
                        document.getElementById("logo").setAttribute('style', 'display: block');
                        mens("No existe órdenes de trabajo en curso", "mens"); return;
                    } else {
                        infor = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;
                        document.getElementById("gridMC").setAttribute('style', 'display: block');
                        document.getElementById("histrialOT").setAttribute('style', 'display: block');
                        if (infor[0].estado_interno == "RECEPCIONADO") { var recp = "RECIBIDO"; }
                        else { var recp = infor[0].estado_interno; }
                        infor1.push({
                            numero_ot: infor[0].numero_ot,
                            estado_interno: recp,
                            fecha_recepcion: infor[0].fecha_recepcion,
                            observacion: infor[0].observacion
                            //limiteVelocidadActual: infor[i].limiteVelocidadActual,
                            //lstAlarmas: infor[i].lstAlarmas
                        });
                        if (infor.length == 2) {
                            document.getElementById("gridCL").setAttribute('style', 'display: block');
                            document.getElementById("historialOT1").setAttribute('style', 'display: block');
                            infor2.push({
                                numero_ot: infor[1].numero_ot,
                                estado_interno: infor[1].estado_interno,
                                fecha_recepcion: infor[1].fecha_recepcion,
                                observacion: infor[0].observacion
                                //limiteVelocidadActual: infor[i].limiteVelocidadActual,
                                //lstAlarmas: infor[i].lstAlarmas
                            });
                        }
                    }
                } catch (e) {
                    mens("No existe datos para esta consulta", "mens");
                    return;
                }
            },
            error: function (err) {
                mens("Error en consulta", "mens"); return;
            }
        });
        //if (data.OrdenesGetResult == null) { mens("No existe datos", "warning"); return;}
        var fecha = (screen.width * 20) / 100;
        var ot = (screen.width * 25) / 100;
        var taller = (screen.width * 35) / 100;
        if (infor1.length > 0) {
            $("#listViewHV").kendoGrid({
                allowCopy: true,
                columns: [
                    { field: "numero_ot", title: "No. OT", width: ot },
                    { field: "estado_interno", title: "Estado", width: taller },
                    { field: "fecha_recepcion", title: "Fecha", width: ot }
                ],
                dataSource: infor1,
                selectable: "row"
            });
        }
        if (infor2.length > 0) {
            $("#listViewHVC").kendoGrid({
                allowCopy: true,
                columns: [
                    { field: "numero_ot", title: "No. OT", width: ot },
                    { field: "estado_interno", title: "Estado", width: taller },
                    { field: "fecha_recepcion", title: "Fecha", width: ot }
                ],
                dataSource: infor2,
                selectable: "row"
            });
        }
        if (infor1.length > 0) {
            if (infor1[0].estado_interno == "RECIBIDO") {
                document.getElementById("colorRE").style.background = "green";
                document.getElementById("vistoRE").style.color = "green";
                //document.getElementById("vistoRE1").style.color = "green";
            }
            if (infor1[0].estado_interno == "TRABAJANDO") {
                document.getElementById("colorRE").style.background = "green"; document.getElementById("vistoRE").style.color = "green";
                document.getElementById("colorTR").style.background = "green"; document.getElementById("vistoTR").style.color = "green";
            }
            if (infor1[0].estado_interno == "LAVADO") {
                document.getElementById("colorRE").style.background = "green"; document.getElementById("vistoRE").style.color = "green";
                document.getElementById("colorTR").style.background = "green"; document.getElementById("vistoTR").style.color = "green";
                document.getElementById("colorLA").style.background = "green"; document.getElementById("vistoLA").style.color = "green";
            }
            if (infor1[0].estado_interno == "CONTROL_CALIDAD") {
                document.getElementById("colorRE").style.background = "green"; document.getElementById("vistoRE").style.color = "green";
                document.getElementById("colorTR").style.background = "green"; document.getElementById("vistoTR").style.color = "green";
                document.getElementById("colorLA").style.background = "green"; document.getElementById("vistoLA").style.color = "green";
                document.getElementById("colorCO").style.background = "green"; document.getElementById("vistoCO").style.color = "green";
                document.getElementById("colorLT").style.background = "green"; document.getElementById("vistoLT").style.color = "green";
                document.getElementById("vistoLT1").style.color = "red";
            }
            observa = infor1[0];
        }
        if (infor2.length > 0) {
            if (infor2[0].estado_interno == "PROFORMADO") {
                document.getElementById("colorPRO").style.background = "green"; document.getElementById("vistoPRO").style.color = "green";
            }
            if (infor2[0].estado_interno == "LAVADO") {
                document.getElementById("colorPRO").style.background = "green"; document.getElementById("vistoPRO").style.color = "green";
                document.getElementById("colorLVA").style.background = "green"; document.getElementById("vistoLVA").style.color = "green";
            }
            if (infor2[0].estado_interno == "CONTROL_CALIDAD") {
                document.getElementById("colorPRO").style.background = "green"; document.getElementById("vistoPRO").style.color = "green";
                document.getElementById("colorLVA").style.background = "green"; document.getElementById("vistoLVA").style.color = "green";
                document.getElementById("colorCCC").style.background = "green"; document.getElementById("vistoCCC").style.color = "green";
                document.getElementById("vistoCCC1").style.color = "red";
            }
            observa1 = infor2[0];
        }
    } catch (e) {
        //alert(e);
        mens("Error de conexi" + String.fromCharCode(243) + "n a la base", "mens"); return;
    }
}
function observacion() {
    if(observa.observacion != ""){
        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
            "AVISO", "<span align='justify'>" + observa.observacion + "</b></span>" , true);
    }else{mens("No existe observacion","mens");}
}
function observacion1() {
    if(observa1.observacion != ""){
        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
            "AVISO", "<span align='justify'>" + observa1.observacion + "</b></span>" , true);
    }else{mens("No existe observacion","mens");}
}
