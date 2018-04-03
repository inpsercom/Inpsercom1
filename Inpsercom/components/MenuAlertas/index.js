app.menuAlertas = kendo.observable({
    init: function () { },
    onShow: function () {
        kendo.ui.progress($("#menuAlertasScreen"), false);
        $("#NoOrdenAL").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
    },
    afterShow: function () { }
});

app.localization.registerView('menuAlertas');

function excesos() {
    kendo.ui.progress($("#menuAlertasScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/ReporteAlertas/view.html");
    }, 2000);
}

/*function panico() {
    kendo.mobile.application.navigate("components/ReportePanicos/view.html");
}*/

function geocercas() {
    kendo.ui.progress($("#menuAlertasScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/ReporteGeocercas/view.html");
    }, 2000);
}

function apaencendido() {
    kendo.ui.progress($("#menuAlertasScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/ReporteApaEncendidos/view.html");
    }, 2000);
}

function paradas() {
    kendo.ui.progress($("#menuAlertasScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/ReporteParadas/view.html");
    }, 2000);
}