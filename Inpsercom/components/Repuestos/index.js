app.menurepuestos = kendo.observable({
    init: function () { },
    onShow: function () {
        try {
            //    $("#NumeroChasisMenu").text(datos_Cliente.chasis);
            // RRP: alias
            $("#NumeroChasisMenuRE").text(datos_Cliente.nombre_alias);
            var Registro = sessionStorage.getItem("Registro");
            kendo.ui.progress($("#menurepuestosScreen"), false);
        } catch (e) { mens("Variable sesi" + String.fromCharCode(243) + "n no existe ", "mens"); }
    },
    afterShow: function () { }
});
app.localization.registerView('menurepuestos');

function cotiza() {
    kendo.ui.progress($("#menurepuestosScreen"), true);
    setTimeout(function () {
        window.open(urlCotizaRep, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        terminaR();
    }, 2000);
}
function garantiaRE() {
    kendo.ui.progress($("#menurepuestosScreen"), true);
    setTimeout(function () {
        //window.open("http://200.31.10.92:8092/appk_aekia/garantia_repuestos.pdf", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=100,width=100,height=100");
        //terminaR();
        kendo.mobile.application.navigate("components/PdfGarantia/view.html");
    }, 2000);
}
function terminaR() {
    kendo.ui.progress($("#menurepuestosScreen"), false);
}
