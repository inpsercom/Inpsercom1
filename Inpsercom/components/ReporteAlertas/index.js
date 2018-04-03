var registro;
app.reporteAlertas = kendo.observable({
    onShow: function () {
        try {
            $("#NoOrdenEX").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
            registro = "";
            var wd = (screen.width / 2) - 30;
            var wx = wd - 15;
            document.getElementById("FechaInicioRA").style.width = wd + "px";
            document.getElementById("FechaFinRA").style.width = wd + "px";
            var fecha = new Date();
            var year = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            if (document.getElementById("FechaInicioRA").value == "") {
                document.getElementById("FechaInicioRA").value = dia + "-" + (mes + 1) + "-" + year;
            }
            $("#FechaInicioRA").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                value: document.getElementById("FechaInicioRA").value,
                format: "dd-MM-yyyy",
                max: new Date(year, mes, dia)
            });
            $("#FechaFinRA").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                max: new Date(year, mes, dia),
                value: new Date(),
                format: "dd-MM-yyyy"
            });
            //document.getElementById("FechaInicio").value = "01-01-1910";
            //ConsultarOT();
            //document.getElementById("FechaInicio").value = document.getElementById("FechaFin").value;*/
        } catch (e) { mens("Error en fechas", "mens"); return;}
    },
    afterShow: function () { },
    inicializa: function () {
    },
    datos: [],
    listViewRAClick: function (e) {
        try {
            //var servicioRA = JSON.stringify(e.dataItem);
            registro = JSON.stringify(e.dataItem);
            //sessionStorage.setItem("servicioRA", servicioRA);
            //window.location = "index.html#components/DetalleServicio/detalleservicio.html";
            kendo.mobile.application.navigate("components/ReporteExceso/view.html");
        } catch (s) {
            mens("Error selecci" + String.fromCharCode(243) + "n de registro", "mens"); return;
        }
    }
});
app.localization.registerView('reporteAlertas');
function regresaE() {
    registro = "";
    document.getElementById("FechaInicioRA").value = "";
    $("#listViewRA").kendoGrid().dataSource = "";
    kendo.mobile.application.navigate("components/MenuAlertas/view.html");
}

function llamarcoordenadasRA() {
    kendo.ui.progress($("#reporteAlertasScreen"), true);
    setTimeout(function () {
        traeCordenadasUbicaRA();
    }, 2000);
}

function traeCordenadasUbicaRA() {
    var reporte;
    try {
        var cords = [];
        var FechaRecEX = document.getElementById("FechaInicioRA").value;
        var FechaRecEX1 = document.getElementById("FechaFinRA").value;;
        var ordenUsuario = datos_Vehiculo.numeroorden; //sessionStorage.getItem("Orden");
        var Url = urlsherlocReport + "ReporteExVelocidad/" + FechaRecEX + "/" + FechaRecEX1;// + "?" + ordenUsuario;
        var params = {
            orden: ordenUsuario,
            output: "json"
        };
        $.ajax({
            url: Url,
            type: "GET",
            data: params,
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    data = data.ReporteExVelocidadResult.lstReporteAlarmas;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].totalRegistros != "0") {
                            cords.push({
                                Fecha: data[i].Fecha,
                                totalRegistros: data[i].totalRegistros,
                                valorMaximoRegistrado: data[i].valorMaximoRegistrado,
                                limiteVelocidadActual: data[i].limiteVelocidadActual,
                                lstAlarmas: data[i].lstAlarmas
                            });
                        }
                    }
                } catch (e) {
                    mens("Error coordenadas servicio sherloc", "mens"); kendo.ui.progress($("#reporteAlertasScreen"), false); return;
                }
            },
            error: function (err) {
                mens("Error servicio sherloc", "mens"); kendo.ui.progress($("#reporteAlertasScreen"), false); return;
            }
        });
        /*FechaUbicacion
            Latitud
            Longitud
            Kilometraje*/
        var fechaU = (screen.width * 30) / 100;
        var Lati = (screen.width * 28) / 100;
        var Kilo = (screen.width * 22) / 100;
        $("#listViewRA").kendoGrid({
            allowCopy: true,
            columns: [
                { field: "Fecha", title: "Fecha", width: Lati },
                { field: "totalRegistros", title: "Excesos", width: Kilo },
                { field: "valorMaximoRegistrado", title: "Veloc.", width: Kilo },
                { field: "limiteVelocidadActual", title: "Veloc. Limite", width: fechaU }
            ],
            dataSource: cords,
            selectable: "row",
            change: function (e) {
                var selectedRows = this.select();
                var selectedDataItems = [];
                for (var i = 0; i < selectedRows.length; i++) {
                    var dataItem = this.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }
                //alert(inspeccionar(selectedDataItems[0].lstAlarmas));
                registro = selectedDataItems[0];
                //alert(inspeccionar(registro.lstAlarmas));
                kendo.mobile.application.navigate("components/ReporteExceso/view.html");
            }
        });
    } catch (d) {
        mens("Error en servicio sherloc", "mens"); kendo.ui.progress($("#reporteAlertasScreen"), false); return;
    }
    kendo.ui.progress($("#reporteAlertasScreen"), false);
}