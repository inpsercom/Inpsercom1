var registroAE;
app.reporteApaEnces = kendo.observable({
    onShow: function () {
        try {
            $("#NoOrdenAE").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
            document.getElementById("btnConsultarAE").style.borderColor = "#bb162b";
            registroAE = "";
            var wd = (screen.width / 2) - 30;
            var wx = wd - 15;
            document.getElementById("FechaInicioAE").style.width = wd + "px";
            document.getElementById("FechaFinAE").style.width = wd + "px";
            var fecha = new Date();
            var year = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            if (document.getElementById("FechaInicioAE").value == "") {
                document.getElementById("FechaInicioAE").value = dia + "-" + (mes + 1) + "-" + year;
            }
            $("#FechaInicioAE").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                value: document.getElementById("FechaInicioAE").value,
                format: "dd-MM-yyyy",
                max: new Date(year, mes, dia),
                animation: {
                    close: {
                        effects: "fadeOut zoom:out",
                        duration: 300
                    },
                    open: {
                        effects: "fadeIn zoom:in",
                        duration: 300
                    }
                }
            });
            $("#FechaFinAE").kendoDatePicker({
                //ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
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
    inicializa: function () { },
    datos: [],
    listViewAEClick: function (e) {
        try {
            //var servicioRA = JSON.stringify(e.dataItem);
            registroAE = JSON.stringify(e.dataItem);
            localStorage.setItem("registro_AE", JSON.stringify(registroAE));
            //sessionStorage.setItem("servicioRA", servicioRA);
            //window.location = "index.html#components/DetalleServicio/detalleservicio.html";
            kendo.mobile.application.navigate("components/ReporteApaEncendidoPuntos/view.html");
        } catch (s) {
            mens("Error selecci" + String.fromCharCode(243) + "n de registro T.R.", "mens"); return;
        }
    }
});
app.localization.registerView('reporteApaEnces');
function regresaAE() {
    registroAE = "";
    document.getElementById("FechaInicioAE").value="";
    $("#listViewAE").kendoGrid().dataSource = "";
    kendo.mobile.application.navigate("components/MenuAlertas/view.html");
}

function llamarcoordenadasAE() {
    kendo.ui.progress($("#reporteApaEncesScreen"), true);
    setTimeout(function () {
        traeCordenadasUbicaAE();
    }, 2000);
}

function traeCordenadasUbicaAE() {
    try {
        document.getElementById("listViewAE").innerHTML = "";
        var cords = [];
        var mensaje;
        var FechaRecAE = document.getElementById("FechaInicioAE").value;
        var FechaRecAE1 = document.getElementById("FechaFinAE").value;;
        var ordenUsuario = datos_Vehiculo.numeroorden; //sessionStorage.getItem("Orden");
        var Url = urlsherlocReport + "ReporteApagadoEncendido/" + FechaRecAE + "/" + FechaRecAE1;// + "?orden=" + ordenUsuario;
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
                    if (data.ReporteApagadoEncendidoResult.message != null) {
                        mensaje = data.ReporteApagadoEncendidoResult.message;
                        mens(data.ReporteApagadoEncendidoResult.message, "mens");
                        kendo.ui.progress($("#reporteApaEncesScreen"), false); return;
                    }
                    var data1 = data.ReporteApagadoEncendidoResult.lstReporteAlarmas;
                    for (var i = 0; i < data1.length; i++) {
                       if (data1[i].TotalRecorrido != "0") {
                            cords.push({
                                Fecha: data1[i].Fecha,
                                TotalRecorrido: data1[i].TotalRecorrido,
                                TotalTiempoEncendido: data1[i].TotalTiempoEncendido,
                                lstRecorridos: data1[i].lstRecorridos
                            });
                        }
                    }
                } catch (e) {
                    mens("Error coordenadas servicio sherloc", "mens"); kendo.ui.progress($("#reporteApaEncesScreen"), false); return;
                }
            },
            error: function (err) {
                mens("Error servicio sherloc", "mens"); kendo.ui.progress($("#reporteApaEncesScreen"), false); return;
            }
        });
        if (mensaje == null) {
            var fechaU = (screen.width * 27) / 100;
            var Lati = (screen.width * 33) / 100;
            var Kilo = (screen.width * 40) / 100;
            $("#listViewAE").kendoGrid({
                allowCopy: true,
                columns: [
                    { field: "Fecha", title: "Fecha", width: fechaU },
                    { field: "TotalRecorrido", title: "Km Recorrido", width: Lati },
                    { field: "TotalTiempoEncendido", title: "Min Encendido", width: Kilo }
                    //{ field: "Velocidad", title: "Velocidad", width: Kilo }
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
                    registroAE = selectedDataItems[0].lstRecorridos;
                    localStorage.setItem("registro_AE", JSON.stringify(registroAE));
                    kendo.mobile.application.navigate("components/ReporteApaEncendidoPuntos/view.html");
                }
            });
        }  
    } catch (d) {
        mens("Error en servicio sherloc", "mens"); kendo.ui.progress($("#reporteApaEncesScreen"), false); return;
    }
    kendo.ui.progress($("#reporteApaEncesScreen"), false);
}
