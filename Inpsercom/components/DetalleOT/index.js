//'use strict';
var infordet;
app.detalleOT = kendo.observable({
    onShow: function () {
        
            //$("#NumeroChasisDOT").text(datos_Cliente.chasis);
            // RRP: alias - detalleot
            $("#detalleOT").clear;
            
            $("#NumeroChasisDOT").text(datos_Cliente.nombre_alias);
            llamardetalleOTS();
            
        
    },
    afterShow: function () { },
    inicializa: function () {

    }
});
app.localization.registerView('detalleOT');

function regresaDetalleOT() {
    try {
        infordet = null;
        document.getElementById("detalleOT").innerHTML = "";
        kendo.mobile.application.navigate("components/OrdenesTrabajo/view.html");
    } catch (e) {
        mens("Error en conexion","mens");
    }
    
}

function llamardetalleOTS() {
    kendo.ui.progress($("#detalleOTScreen"), true);
    setTimeout(function () {
        detalleOTS();
    }, 2000);
}

function detalleOTS() {
    try {
    var Url = urlService + "Detalle/" + registro.codigo_empresa + "," + registro.anio_ga35 + "," + registro.secuencia_orden;
    infordet = "";
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                if (data.DetalleOTGetResult == null) {
                    mens("No existe datos", "mens");
                    return;
                }
                infordet = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;
            } catch (e) {
                mens("Error en lectura de detalle OT", "mens"); kendo.ui.progress($("#detalleOTScreen"), false); return;
            }
        },
        error: function (err) {
            mens("Error en servicio Detalle OT", "mens"); kendo.ui.progress($("#detalleOTScreen"), false); return;//alert(JSON.stringify(err));
        }
    });

    var descri = (screen.width * 50) / 100;
    var cant = (screen.width * 25) / 100;
    var alto = screen.height - 150;
    $("#detalleOT").kendoGrid({
        //height: alto,
        //mobile: "phone",
        //resizable: true,
        //toolbar: ["create"],
        columns: [
            { field: "Descripcion", title: "Descripción", footerTemplate: "Total:", width: descri },
            { field: "Cantidad", title: "Cantidad", width: cant },
            { field: "Total", format: "{0:c}", title: "Total", footerTemplate: "#= kendo.toString(sum, '0.00') #", width: cant }

        ],
        dataSource: {
            data: infordet,
            aggregate: [
                { field: "Descripcion", aggregate: "count" },
                { field: "Cantidad", aggregate: "sum" },
                { field: "Total", aggregate: "sum" }
            ]
        },
        //editable: "popup",
        //filterable: true,
        //sortable: true,
        //columnMenu: true,
        selectable: "row"
    });
    } catch (e) {
        mens("Error en servicio Progress", "mens"); kendo.ui.progress($("#detalleOTScreen"), false); return;
    }
    document.getElementById("txtDetalle").innerHTML = registro.observacion.substring(2, registro.observacion.length);
    kendo.ui.progress($("#detalleOTScreen"), false);
}
