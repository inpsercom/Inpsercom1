//'use strict';
var registroAE1;
var registroAEaux;
app.detalleTR = kendo.observable({
    onShow: function () {
        llamarAE();
    },
    afterShow: function () { },
    inicializa: function () { },
    datos: [],
    listViewAEClick: function (e) {
        try {
            //var servicioRA = JSON.stringify(e.dataItem);
            registroAE1 = JSON.stringify(e.dataItem);
            //sessionStorage.setItem("servicioRA", servicioRA);
            //window.location = "index.html#components/DetalleServicio/detalleservicio.html";
            kendo.mobile.application.navigate("components/ReporteApaEncendido/view.html");
        } catch (s) {
            mens("Error selecci" + String.fromCharCode(243) + "n de registro T. R.", "mens"); return;
        }
    }
});
app.localization.registerView('detalleOT');

function llamarAE() {
    kendo.ui.progress($("#detalleTRScreen"), true);
    setTimeout(function () {
        apagadoencendidos();
    }, 2000);
}

function apagadoencendidos() {
    try {
        $("#NoOrdenTR").text(datos_Cliente.nombre_alias + ": " + datos_Vehiculo.numeroorden);
        registroAEaux = JSON.parse(localStorage.getItem("registro_AE"));
        //alert(inspeccionar(registroAEaux[0]));
        for (var t = 0; t < registroAEaux.length; t++) {
            registroAEaux[t].FechaInicial = registroAEaux[t].FechaInicial.substr(11, (registroAEaux[t].FechaInicial.length - 11));
            registroAEaux[t].FechaFinal = registroAEaux[t].FechaFinal.substr(11, (registroAEaux[t].FechaFinal.length - 11));
        }
        var descri = (screen.width * 50) / 100;
        var cant = (screen.width * 25) / 100;
        $("#detalleTR").kendoGrid({
            allowCopy: true,
            columns: [
                { field: "FechaInicial", title: "Hora Inicio", width: cant },
                { field: "FechaFinal", title: "Hora Fin", width: cant },
                { field: "Recorrido", title: "Recorrido", width: cant },
                { field: "TiempoEncendido", title: "Tiempo", width: cant }
            ],
            dataSource: registroAEaux,
            selectable: "row",
            change: function (e) {
                var selectedRows = this.select();
                var selectedDataItems = [];
                for (var i = 0; i < selectedRows.length; i++) {
                    var dataItem = this.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }
                registroAE1 = selectedDataItems[0];
                kendo.mobile.application.navigate("components/ReporteApaEncendido/view.html");
            }
        });
    } catch (e) {
        //alert(e);
        mens("Error en servicio Progress", "mens"); kendo.ui.progress($("#detalleTRScreen"), false); return;
    }
    kendo.ui.progress($("#detalleTRScreen"), false);
}
