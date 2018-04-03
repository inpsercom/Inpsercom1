//'use strict';
var registro;
var banderaOT;
app.mntOTs = kendo.observable({
    onShow: function () {
        try {
            registro = "";
            //  $("#NumeroChasisOT").text(datos_Cliente.chasis);
            // RRP: alias - ordenestrabajo
            $("#NumeroChasisOT").text(datos_Cliente.nombre_alias);

            var wd = (screen.width / 2) - 30;
            var wx = wd - 15;
            document.getElementById("FechaInicio").style.width = wd + "px";
            document.getElementById("FechaFin").style.width = wd + "px";
            var fecha = new Date();
            var year = fecha.getFullYear();
            var mes = fecha.getMonth() + 1;
            var dia = fecha.getDate();
            document.getElementById("FechaFin").value = dia + "-" + mes + "-" + year;
            var fechaI = consultar();
            if (fechaI == "?") { fechaI = new Date(); } else { fechaI = new Date(fechaI); }
            var yearI = fechaI.getFullYear();
            var mesI = fechaI.getMonth() + 1;
            var diaI = fechaI.getDate();
            document.getElementById("FechaInicio").value = diaI + "-" + mesI + "-" + yearI;
            if (document.getElementById("FechaInicio").value == "") {
                document.getElementById("FechaInicio").value = diaI + "-" + mesI + "-" + yearI;
            }
            $("#FechaInicio").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                value: document.getElementById("FechaInicio").value,
                format: "dd-MM-yyyy",
                max: new Date(year, mes, dia)
            });
            $("#FechaFin").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                max: new Date(year, mes, dia),
                value: new Date(),
                format: "dd-MM-yyyy",
                max: new Date(year, mes, dia)
            });
            //alert(document.getElementById("cboxOT").cheked);
            //document.getElementById("FechaInicio").value = "01-01-1910";
            ConsultarOT();
            //document.getElementById("FechaInicio").value = document.getElementById("FechaFin").value;
        } catch (e) { mens("Error en fechas", "mens"); return; }
    },
    afterShow: function () { },
    inicializa: function () {
        try {
            app.mntOTs.onShow();
            var obs = (screen.width * 9) / 100;
            var fecha = (screen.width * 14) / 100;
            var ot = (screen.width * 17) / 100;
            var taller = (screen.width * 12) / 100
            var alto = screen.height - 150;;
            $("#listView").kendoGrid({
                allowCopy: true,
                columns: [
                    { field: "fecha_recepcion", title: "Fecha", width: fecha },
                    { field: "numero_ot", title: "No. OT", width: ot },
                    { field: "nombre_taller", title: "Taller", width: fecha },
                    { field: "kilometraje", title: "Km.", width: taller },
                    {title: "OBS",width: obs,
                        command: [{className: "btnRojo",name: "o",
                            visible: function (dataItem) { return dataItem.observacion != "0," },
                            click: function (e) {
                                try {
                                    e.preventDefault();
                                    banderaOT = 1;
                                    var tr = $(e.target).closest('tr');
                                    var dataItem = this.dataItem(tr);
                                    mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                                        "OBSERVACION", "<span align='justify'>" + dataItem.observacion.substring(2, dataItem.observacion.length) + "</b></span>", true, true);
                                } catch (f) {
                                    mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                                       "OBSERVACION", "<span align='justify'>" + f + "</b></span>", true, true);

                                }
                            }
                        }], 
                    }
                ],
                selectable: "row",
                change: function (e) {
                    if (banderaOT == 1) { banderaOT = 0; return; }
                    var selectedRows = this.select();
                    var selectedDataItems = [];
                    for (var i = 0; i < selectedRows.length; i++) {
                        var dataItem = this.dataItem(selectedRows[i]);
                        selectedDataItems.push(dataItem);
                    }
                    registro = selectedDataItems[0];
                    //var grid = $("#listView").data("kendoGrid");     
                    //grid.dataSource.sort({ field: "fecha_recepcion", dir: "desc" });
                    kendo.mobile.application.navigate("components/DetalleOT/view.html");
                }
            });
            //ConsultarOT();
        } catch (e) {mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                     "ERROR", "<span align='justify'>" + e + "</b></span>", true, true);
        }
    },
    datos: [],
    listViewClick: function (e) {
        try {
            if (banderaOT == 1) { banderaOT = 0; return; }
            var servicioOT = JSON.stringify(e.dataItem);
            sessionStorage.setItem("servicio", servicioOT);
            //window.location = "index.html#components/DetalleServicio/detalleservicio.html";
            kendo.mobile.application.navigate("components/DetalleOT/view.html");
        } catch (s) {
            mens("Error selecci" + String.fromCharCode(243) + "n de registro", "mens"); return;
        }
    }
});
app.localization.registerView('mntOTs');

function regresaOT() {
    document.getElementById("FechaInicio").value = "";
    document.getElementById("listView").value = "";
    kendo.mobile.application.navigate("components/miKia/view.html");
}

function llamarconsultarOT() {
    kendo.ui.progress($("#mntOTsScreen"), true);
    setTimeout(function () {
        ConsultarOT();
    }, 2000);
}

function consultar() {
    var infor;
    try {
        var usu = localStorage.getItem("Inp_DatosUsuario");
        // RRP: 18072017
        var Url = urlService + "Ordenes/" + "1,2," + datos_Cliente.chasis + ",01-01-1900," + document.getElementById("FechaFin").value;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infor = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;
                } catch (e) {
                    mens("No existe datos para esta cosnulta", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return;
                }
            },
            error: function (err) {
                mens("Error en consulta OT", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return;
            }
        });
    } catch (e) {
        mens("Error de conexi" + String.fromCharCode(243) + "n a base", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return;
    }
    kendo.ui.progress($("#mntOTsScreen"), false);
    return infor[0].fecha_retail;
}
function ConsultarOT() {
    try {
        /*if(document.getElementById("cboxOT").checked == false){
            document.getElementById("FechaInicio").value = "01-01-1910";
        }*/
        if (document.getElementById("FechaInicio").value == "" || !document.getElementById("FechaInicio").value) { mens("Fecha inicio no ha sido seleccionada", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return; }
        if (document.getElementById("FechaFin").value == "" || !document.getElementById("FechaFin").value) { mens("Fecha fin no ha sido seleccionada", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return; }
        var fechaI = new Date(document.getElementById("FechaInicio").value);
        var fechaF = new Date(document.getElementById("FechaFin").value);
        if (fechaI > fechaF) { mens("Error fecha inicio mayor a la final", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return; }
    } catch (f) { mens("Error en fechas", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return; }
    try {
        var usu = localStorage.getItem("Inp_DatosUsuario");
        var Url = urlService + "Ordenes/" + "1,2," + datos_Cliente.chasis + "," + document.getElementById("FechaInicio").value + "," + document.getElementById("FechaFin").value + ",500";
        var infor;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infor = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;
                } catch (e) {
                    mens("No existe datos para esta consulta", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return;
                }
            },
            error: function (err) {
                mens("Error en consulta OT", "mens"); kendo.ui.progress($("#mntOTsScreen"), false); return;
            }
        });
        var dataSource = new kendo.data.DataSource({ data: infor });
        var grid = $("#listView").data("kendoGrid");
        grid.setDataSource(dataSource);
    } catch (e) {
        kendo.ui.progress($("#mntOTsScreen"), false); return;
        //mens("Error de conexión a la base", "mens"); return;
    }
    /*if(document.getElementById("cboxOT").checked == false){
             document.getElementById("FechaInicio").value = document.getElementById("FechaFin").value;
         }*/
    kendo.ui.progress($("#mntOTsScreen"), false);
}

