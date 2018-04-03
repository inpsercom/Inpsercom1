//'use strict';
var FechaRec;
app.fechaReco = kendo.observable({
    onShow: function () {
        try {
            $("#NoOrdenRA").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
            document.getElementById("FechaRecor").style.fontSize = "large";
            document.getElementById("myLabel").style.fontSize = "large";
            document.getElementById("myLabel").style.color = "black";
            document.getElementById("btnConsultarFecha").style.fontSize = "large";
            FechaRec = new Date();
            var fecha = new Date();
            var year = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            if (document.getElementById("FechaRecor").value == "") {
                document.getElementById("FechaRecor").value = dia + "-" + (mes+1) + "-" + year;
            }
            $("#FechaRecor").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(year, (mes - 2), dia),
                value: document.getElementById("FechaRecor").value,
                format: "dd-MM-yyyy",
                max: new Date(year, mes, dia)
            });
        } catch (e) { mens("Error en la fecha", "mens"); return;}
    },
    afterShow: function () { },
    inicializa: function () { },

});
app.localization.registerView('fechaReco');
function regresaREC(){
    document.getElementById("FechaRecor").value = "";
    kendo.mobile.application.navigate("components/OrdenInstalacion/view.html");
}

function llamarconsultarRC() {
    kendo.ui.progress($("#fechaRecoScreen"), true);
    setTimeout(function () {
        Consultar();
    }, 2000);
}
function Consultar() {
    if (document.getElementById("FechaRecor").value == "" || !document.getElementById("FechaRecor").value) { mens("Fecha inicio no ha sido seleccionada", "mens"); kendo.ui.progress($("#fechaRecoScreen"), false); return; }
    FechaRec = document.getElementById("FechaRecor").value;
    kendo.mobile.application.navigate("components/ControlarAuto/view.html");
    kendo.ui.progress($("#fechaRecoScreen"), false);
}
