var registroGC;
var registroGC1;
app.reporteGeocercas = kendo.observable({
    onShow: function () {
        try {
            $("#NoOrdenGC").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);
            registroGC = "";
            var wd = (screen.width / 2) - 30;
            var wx = wd - 15;
            document.getElementById("FechaInicioGC").style.width = wd + "px";
            document.getElementById("FechaFinGC").style.width = wd + "px";
            var fecha = new Date();
            var year = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            if (document.getElementById("FechaInicioGC").value == "") {
                document.getElementById("FechaInicioGC").value = dia + "-" + (mes+1) +"-" + year;
            }
            $("#FechaInicioGC").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                value: document.getElementById("FechaInicioGC").value,
                format: "dd-MM-yyyy",
                max: new Date(year, mes, dia)
            });
            $("#FechaFinGC").kendoDatePicker({
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
    listViewGCClick: function (e) {
        try {
            //var servicioRA = JSON.stringify(e.dataItem);
            registroGC = JSON.stringify(e.dataItem);
            //sessionStorage.setItem("servicioRA", servicioRA);
            //window.location = "index.html#components/DetalleServicio/detalleservicio.html";
            kendo.mobile.application.navigate("components/ReporteGeocerca/view.html");
        } catch (s) {
            mens("Error selecci" + String.fromCharCode(243) + "n de registro C. V.", "mens"); return;
        }
    }
});
app.localization.registerView('reporteGeocercas');
function regresaGC() {
    registroGC = "";
    registroGC1 = "";
    document.getElementById("FechaInicioGC").value = "";
    $("#listViewGC").kendoGrid().dataSource = "";
    kendo.mobile.application.navigate("components/MenuAlertas/view.html");
}

function llamarcoordenadasGC() {
    kendo.ui.progress($("#reporteGeocercasScreen"), true);
    setTimeout(function () {
        traeCordenadasUbicaGC();
    }, 2000);
}

function traeCordenadasUbicaGC() {
    try {
        var cords = [];
        var cords1 = [];
        var data1;
        var FechaRecGC = document.getElementById("FechaInicioGC").value;
        var FechaRecGC1 = document.getElementById("FechaFinGC").value;;
        var ordenUsuario = datos_Vehiculo.numeroorden; //sessionStorage.getItem("Orden");
        var Url = urlsherlocReport + "ReporteGeoCercas/" + FechaRecGC + "/" + FechaRecGC1; // + "?" + ordenUsuario;
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
                    data = data.ReporteGeoCercasResult.lstGeocercas;
                    var data1 = data[0].lstGeoRegistrada;
                    for (var j = 0; j < data1.length; j++) {
                        if (data1[j] != null) {
                            cords1.push({
                                numGeocerca: data1[j].numGeocerca,
                                lstCoordenadas: data1[j].lstCoordenadas
                            });
                        }
                    }
                    registroGC1 = cords1;
                    for (var i = 0; i < data[0].lstPuntosGeo.length; i++) {
                        if (data[0].lstPuntosGeo[i] != null) {
                            if (data[0].lstPuntosGeo[i].lstCoordGeo != null) {
                                cords.push({
                                    Fecha: data[0].lstPuntosGeo[i].Fecha,
                                    lstCoordGeo: data[0].lstPuntosGeo[i].lstCoordGeo
                                    //Latitud: data[i].Latitud,
                                    //Longitud: data[i].Longitud,
                                    //Velocidad: data[i].Velocidad,
                                    //Sentido: data[i].Sentido,
                                    //FecharegistroPA: data[i].FecharegistroPA,
                                    //Estado: data[i].Estado
                                });
                            }
                        }
                    }
                } catch (e) {
                    mens("Error coordenadas servicio sherloc", "mens");
                    kendo.ui.progress($("#reporteGeocercasScreen"), false);
                    return;
                }
            },
            error: function (err) {
                mens("Error servicio sherloc", "mens");
                kendo.ui.progress($("#reporteGeocercasScreen"), false);
                return;
            }
        });
        /*FechaUbicacion
            Latitud
            Longitud
            Kilometraje*/
        var fechaU = (screen.width * 20) / 100;
        var Lati = (screen.width * 30) / 100;
        var Kilo = (screen.width * 20) / 100;
        $("#listViewGC").kendoGrid({
            allowCopy: true,
            columns: [
                { field: "Fecha", title: "Fecha", width: fechaU }
                //,{ field: "Latitud", title: "Latitud", width: Lati },
                //{ field: "Longitud", title: "Logitud", width: Lati },
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
                registroGC = selectedDataItems[0];
                //alert(inspeccionar(registroPA.lstAlarmas));
                kendo.mobile.application.navigate("components/ReporteGeocerca/view.html");
            }
        });
    } catch (d) {
        mens("Error en servicio sherloc", "mens"); kendo.ui.progress($("#reporteGeocercasScreen"), false); return;
    }
    kendo.ui.progress($("#reporteGeocercasScreen"), false);
}