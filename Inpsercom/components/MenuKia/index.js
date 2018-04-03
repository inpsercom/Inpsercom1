app.menuKia = kendo.observable({
    init: function () { },
    onShow: function () {
        try {
            //    $("#NumeroChasisMenu").text(datos_Cliente.chasis);
            // RRP: alias
            $("#NumeroChasisMenu").text(datos_Cliente.nombre_alias);
            var Registro = sessionStorage.getItem("Registro");
            kendo.ui.progress($("#menuKiaScreen"), false);
            datos_sherloc = '';
        } catch (e) {mens("Variable sesi"+ String.fromCharCode(243) + "n no existe ","mens"); }
    },
    afterShow: function () { }
});
app.localization.registerView('menuKia');
var data1;
function logoutMenu() {
    navigator.app.exitApp();
}
function ConfigurarSherlock() {
    try {
        var cedulaCF;
        if (datos_Vehiculo.identificacion_flota == "0") {
            cedulaCF = datos_Vehiculo.identificacion_cliente;
        } else {
            cedulaCF = datos_Vehiculo.identificacion_flota;
        }
        var Url = urlsherlocMenu + datos_Cliente.chasis.toUpperCase() + "/R/" + cedulaCF + "/1234567890/" + datos_Cliente.telefono_celular;
        $.ajax({
            url: Url, type: "GET", dataType: "json", async: false,
            success: function (data) {
                data1 = data.perfilClienteResult;
                //alert(inspeccionar(data1));
            },
            error: function (err) {
                mens("Error servicio Sherloc", "mens"); kendo.ui.progress($("#menuKiaScreen"), false); return;
                //kendo.ui.progress($("#miKia2Screen"), false);
            }
        });
    } catch (e) { mens("Error servicio Sherloc", "mens"); kendo.ui.progress($("#menuKiaScreen"), false); return; }

    if (data1.orden == 0) {
        datos_Vehiculo.terminos = "no";
        localStorage.setItem("Inp_DatosVehiculo", JSON.stringify(datos_Vehiculo));
        mens("Cliente no tiene servicio", "mens"); kendo.ui.progress($("#menuKiaScreen"), false); return;
    }
    datos_Vehiculo.numeroorden = data1.orden;
    datos_Vehiculo.tipoContratoSherloc = data1.tipoContrato;
    datos_sherloc = data1;
    if (datos_Vehiculo.terminos == "no") {
        kendo.mobile.application.navigate("components/TerminosCondic2/view.html");
    }
    else {
        if (data1.tipoContrato == "GOLDEN") {
            kendo.mobile.application.navigate("components/OrdenInstalacion/view.html");
        } else { kendo.mobile.application.navigate("components/OrdenInstalacionBasico/view.html"); }
    }
    kendo.ui.progress($("#menuKiaScreen"), false);
}

function AdmVehiculos() {
    kendo.ui.progress($("#menuKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/MantenimientoVehiculos/view.html");
    }, 2000);
}
function postventa() {
    kendo.ui.progress($("#menuKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/MenuPostventa/view.html");
    }, 2000);
}
function compraKia() {
    kendo.ui.progress($("#menuKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/MenuCompraKia/view.html");
    }, 2000);
}
function llamarconsultarSH() {
    kendo.ui.progress($("#menuKiaScreen"), true);
    setTimeout(function () {
        ConfigurarSherlock();
    }, 2000);
}
function asistenciaKia() {
    kendo.ui.progress($("#menuKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/AsistenciaKia/view.html");
    }, 2000);
}
function repuestos() {
    kendo.ui.progress($("#menuKiaScreen"), true);
    setTimeout(function () {
        kendo.mobile.application.navigate("components/Repuestos/view.html");
    }, 2000);
}