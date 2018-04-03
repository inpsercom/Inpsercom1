app.menuAsistencia = kendo.observable({
    init: function () { },
    onShow: function () {
        try {
            //    $("#NumeroChasisMenu").text(datos_Cliente.chasis);
            // RRP: alias
            $("#NumeroChasisMenuAV").text(datos_Cliente.nombre_alias);
            var Registro = sessionStorage.getItem("Registro");
            kendo.ui.progress($("#menuAsistenciaScreen"), false);
        } catch (e) { mens("variable sesi" + String.fromCharCode(243) + "n no existe ", "mens"); }
    },
    afterShow: function () { }
});
app.localization.registerView('menuAsistencia');

function aistenciaV() {
    kendo.ui.progress($("#menuAsistenciaScreen"), true);
    setTimeout(function () {
        window.open(urlMenuAsistencia, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        termina();
    }, 2000);
}
function termina() {
    kendo.ui.progress($("#menuAsistenciaScreen"), false);
}
function mantenimiento() {
    kendo.ui.progress($("#menuAsistenciaScreen"), true);
    setTimeout(function () {
        window.open(urlMantenimiento, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        termina();
    }, 2000);
}
function redconcesionariosK() {
    kendo.ui.progress($("#menuAsistenciaScreen"), true);
    setTimeout(function () {
        window.open(urlMenuConcesionarios, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        termina();
    }, 2000);
}
function prepago() {
    kendo.ui.progress($("#menuAsistenciaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/PdfPrepago/view.html");
        //mens("En construccion", "mens");
        //termina();
    }, 2000);
}
function garantiaKia() {
    kendo.ui.progress($("#menuAsistenciaScreen"), true);
    setTimeout(function () {
        window.open(urlGarantiaKia, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        termina();
    }, 2000);
}