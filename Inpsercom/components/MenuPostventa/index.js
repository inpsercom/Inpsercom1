app.menupostventa = kendo.observable({
    init: function () { },
    onShow: function () {
        try {
            //    $("#NumeroChasisMenu").text(datos_Cliente.chasis);
            // RRP: alias
            $("#NumeroChasisMenuP").text(datos_Cliente.nombre_alias);
            var Registro = sessionStorage.getItem("Registro");
            kendo.ui.progress($("#menupostventaScreen"), false);
        } catch (e) { mens("Variable sesi" + String.fromCharCode(243) + "n no existe ", "mens"); }
    },
    afterShow: function () { }
});
app.localization.registerView('menupostventa');

function repuestos() {
    kendo.ui.progress($("#menupostventaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/Repuestos/view.html");
    }, 2000);
}
function servicioKia() {
    kendo.ui.progress($("#menupostventaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/miKia/view.html");
    }, 2000);
}
