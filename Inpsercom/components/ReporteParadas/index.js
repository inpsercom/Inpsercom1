var registroPA;
app.reporteParadas = kendo.observable({
    onShow: function () {
        try {
            $("#NoOrdenPA").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
            registro = "";
            var wd = (screen.width / 2) - 30;
            var wx = wd - 15;
            document.getElementById("FechaInicioPA").style.width = wd + "px";
            document.getElementById("FechaFinPA").style.width = wd + "px";
            var fecha = new Date();
            var year = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            if (document.getElementById("FechaInicioPA").value == "") {
                document.getElementById("FechaInicioPA").value = dia + "-" + (mes + 1) + "-" + year;
            }
            $("#FechaInicioPA").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                value: document.getElementById("FechaInicioPA").value,
                format: "dd-MM-yyyy",
                max: new Date(year, mes, dia)
            });
            $("#FechaFinPA").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                max: new Date(year, mes, dia),
                value: new Date(),
                format: "dd-MM-yyyy"
            });
            //document.getElementById("FechaInicio").value = "01-01-1910";
            //ConsultarOT();
            //document.getElementById("FechaInicio").value = document.getElementById("FechaFin").value;*/
        } catch (e) { mens("Error en fechas", "mens");return; }
    },
    afterShow: function () { },
    inicializa: function () {
    },
    datos: [],
    listViewPAClick: function (e) {
        try {
            //var servicioRA = JSON.stringify(e.dataItem);
            registroPA = JSON.stringify(e.dataItem);
            //sessionStorage.setItem("servicioRA", servicioRA);
            //window.location = "index.html#components/DetalleServicio/detalleservicio.html";
            kendo.mobile.application.navigate("components/ReporteParada/view.html");
        } catch (s) {
            mens("Error selecci" + String.fromCharCode(243) + "n de registro P.", "mens");
            return;
        }
    }
});
app.localization.registerView('reporteParadas');
function regresaPA() {
    registroPA = "";
    document.getElementById("FechaInicioPA").value="";
    $("#listViewPA").kendoGrid().dataSource = "";
    kendo.mobile.application.navigate("components/MenuAlertas/view.html");
}

function llamarcoordenadasPA() {
    kendo.ui.progress($("#reporteParadasScreen"), true);
    setTimeout(function () {
        traeCordenadasUbicaPA();
    }, 2000);
}

function traeCordenadasUbicaPA() {
    var reporte;
    try {
        var cords = [];
        var FechaRecEX = document.getElementById("FechaInicioPA").value;
        var FechaRecEX1 = document.getElementById("FechaFinPA").value;;
        var ordenUsuario = datos_Vehiculo.numeroorden; //sessionStorage.getItem("Orden");
        var Url = urlsherlocReport + "ReporteParadas/" + FechaRecEX + "/" + FechaRecEX1;
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
                    if (data.ReporteParadasResult.message != null) {
                        mens(data.ReporteParadasResult.message, "mens");
                        return;
                    }
                    data = data.ReporteParadasResult.lstReporteAlarmas;
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
                    mens(data.ReporteParadasResult.message, "mens");
                    kendo.ui.progress($("#reporteParadasScreen"), false);
                    return;
                }
            },
            error: function (err) {
                mens("Error servicio sherloc", "mens");
                kendo.ui.progress($("#reporteParadasScreen"), false);
                return;
            }
        });
        var fechaU = (screen.width * 35) / 100;
        var Lati = (screen.width * 30) / 100;
        var Kilo = (screen.width * 35) / 100;
        $("#listViewPA").kendoGrid({
            allowCopy: true,
            columns: [
                { field: "Fecha", title: "Fecha", width: Lati },
                { field: "totalRegistros", title: "Paradas", width: Kilo },
                //{ field: "valorMaximoRegistrado", title: "Velocidad", width: Kilo },
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
                registroPA = selectedDataItems[0];
                //alert(inspeccionar(registroPA.lstAlarmas));
                kendo.mobile.application.navigate("components/ReporteParada/view.html");
            }
        });
    } catch (d) {
        mens("Error en servicio sherloc", "mens");
        kendo.ui.progress($("#reporteParadasScreen"), false);
        return;
    }
    kendo.ui.progress($("#reporteParadasScreen"), false);
}