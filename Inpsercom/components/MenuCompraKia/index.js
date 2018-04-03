app.menuconpak = kendo.observable({
    init: function () { },
    onShow: function () {
        try {
            //    $("#NumeroChasisMenu").text(datos_Cliente.chasis);
            // RRP: alias
            $("#NumeroChasisMenuNS").text(datos_Cliente.nombre_alias);
            var Registro = sessionStorage.getItem("Registro");
            kendo.ui.progress($("#menuconpakScreen"), false);
        } catch (e) { mens("Variable sesi" + String.fromCharCode(243) + "n no existe ", "mens"); }
    },
    afterShow: function () { }
});
app.localization.registerView('menuconpak');

function nuevosK() {
    kendo.ui.progress($("#menuconpakScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/AgendarCita/view.html");
    }, 2000);
}

function seminuevosK() {
    kendo.ui.progress($("#menuconpakScreen"), true);
    setTimeout(function () {
        window.open(urlSeminuevos, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        terminaNS();
    }, 2000);
}

function terminaNS() {
    kendo.ui.progress($("#menuconpakScreen"), false);
}
