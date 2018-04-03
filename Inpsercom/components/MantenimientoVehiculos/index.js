//'use strict';
var acepta;
var ind = 0;
app.mntVehiculos = kendo.observable({
    onShow: function () {
        try {
            acepta = "no"; // RRP: confirmar

            //   $("#NumeroChasisRV").text(datos_Cliente.chasis);
            // RRP: alias
            $("#NumeroChasisRV").text(datos_Cliente.nombre_alias);
            borraVH();
            var email = datos_Cliente.mail;
            if ((email != "") && (email)) {
                actualizaAsignar();
            }
        } catch (d) {
            mens("Error servicio cliente", "mens"); return;
        }

    },
    afterShow: function () {
        validavehiculo(datos_Cliente.mail);
    },
    inicializa: function () {
        try {
            var obs = (screen.width * 15) / 100;
            var alias = (screen.width * 30) / 100;
            var vin = (screen.width * 50) / 100;
            $("#nuevochasisview").kendoGrid({
                columns: [
                    { field: "nombre_alias", title: "Alias", width: alias },
                    { field: "chasis", title: "Vehículo", width: vin }
                ],
                selectable: "row"
            });
            $("#nuevochasisview").data("kendoGrid").bind("change", grid_Change);

            $("#chasisview").kendoGrid({
                allowCopy: true,
                columns: [
                    { field: "nombre_alias", title: "Alias", width: alias },
                    { field: "chasis", title: "Vehículo", width: vin },
                    {
                        width: obs,
                        command: [{ name: "destroy",template: "<div><span><i onclick='grid_remove(this)' class='fa fa-trash' style='width: 100%;color:red;'></i></span></div>",
                    width: obs}] 
                        //text: ".", className: "btnRojoDelete" }]
                    }],
                editable: {
                    confirmation: function (e) {
                        if (ind = 1) {
                            grid_remove(e);
                            //mensajePrmOpc("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                            //    "AVISO", "Quieres borrar el registro<br><br>" , true);  fa fa-trash
                        }
                        e.preventDefault();
                    }
                }
            });
            grid = $("#chasisview").data("kendoGrid");
            grid.bind("remove", grid_remove);
            /*{ command: { name: "destroy", template: "<div><span><i onclick='grid_remove(this)' class='fa fa-trash' style='width: 25%;color:red;'></i></span></div>",
                    width: obs}
                }]
            });*/
            ind = 1;
        } catch (e) { mens("Actualizar veh" + String.fromCharCode(237) + "culo", "mens"); return; }
    }
});
app.localization.registerView('mntVehiculos');
function grid_Change(e) {
    try {
        var selectedRows = this.select();
        var selectedDataItems = [];
        for (var i = 0; i < selectedRows.length; i++) {
            var dataItem = this.dataItem(selectedRows[i]);
            selectedDataItems.push(dataItem);
        }
        registro = selectedDataItems[0];
        datos_Cliente.chasis = registro.chasis;
        datos_Cliente.nombre_alias = registro.nombre_alias; //RRP
        localStorage.setItem("Inp_DatosUsuario", JSON.stringify(datos_Cliente));
        datos_Vehiculo.chasis = registro.chasis;
        datos_Vehiculo.nombre_alias = registro.nombre_alias;
        datos_Vehiculo.numeroorden = registro.numeroorden;
        datos_Vehiculo.placa = registro.placa;
        datos_Vehiculo.identificacion_cliente = registro.identificacion_cliente;
        datos_Vehiculo.identificacion_flota = registro.identificacion_flota;
        localStorage.setItem("Inp_DatosVehiculo", JSON.stringify(datos_Vehiculo));
        $("#NumeroChasisRV").text(datos_Cliente.nombre_alias);
        //datos_Vehiculo = JSON.parse(localStorage.getItem("Inp_DatosVehiculo"));
        //kendo.mobile.application.navigate("components/miKia/view.html");
    } catch (f) { mens("Error servicio actualizar veh" + String.fromCharCode(237) + "culo", "mens"); return; }
}

function actualizaAsignar() {
    try {
        var grid = $("#nuevochasisview").data("kendoGrid");
        var grid1 = $("#chasisview").data("kendoGrid");
        var email = datos_Cliente.mail;
        var resultado = "";
        var Url = urlService + "Vehiculo/" + email;
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    var dataSource = "";
                    if (data.VehiculoGetResult != null) {
                        resultado = JSON.parse(data.VehiculoGetResult).Vehiculo;
                    }
                    dataSource = new kendo.data.DataSource({ data: resultado });
                    grid.setDataSource(dataSource);
                    grid1.setDataSource(dataSource);
                    
                } catch (e) {
                    mens("Error servicio actualizar veh" + String.fromCharCode(237) + "culo", "mens"); return;
                }
            },
            error: function (err) {
                mens("Error conexi" + String.fromCharCode(243) + "n al servicio veh" + String.fromCharCode(237) + "culo", "mens"); return; //alert(JSON.stringify(err));
            }
        });
    } catch (d) {
        mens("Error servicio actualizar veh" + String.fromCharCode(237) + "culo", "mens"); return;
    }
}

function llamargrabarVH() {
    kendo.ui.progress($("#mntVehiculosScreen"), true);
    setTimeout(function () {
        grabarVH();
    }, 2000);
}

function grabarVH() {
    try {
        if (document.getElementById("VIN").value == "" || document.getElementById("VIN").value == " ") { mens("Veh" + String.fromCharCode(237) + "culo esta vacio", "mens"); kendo.ui.progress($("#mntVehiculosScreen"), false); return; }
        var Url = urlService + "ClienteSet";
        var params = {
            "secuencia_mv01": 5,
            "identificacion_cliente": datos_Cliente.identificacion_cliente,
            "persona_nombre": "",
            "persona_apellido": "",
            "mail": datos_Cliente.mail,
            "chasis": document.getElementById("VIN").value,
            "nombre_alias": document.getElementById("AliasAD").value,
            "fecha_nacimiento": "",
            "telefono_celular": "",
            "numeroorden": "",
            "password": "",
            "persona_numero": "",
            "alta_movil_imei": ""
            //output: "json"
        };
        $.ajax({
            url: Url, type: "POST", data: JSON.stringify(params), dataType: "json", //Content-Type: application/json
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            success: function (data) {
                if (data.substring(0, 1) == "0") {
                    if (data.substring(0, 1) == "0" || data.substring(0, 1) == "1") { data = data.substring(2, data.length); }
                    mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                     "Advertencia", "<span align='justify'>" + data + "</b></span>", true, true);  
                } else {
                    try {
                        mens("Registro Exitosos", "mens");
                        borraVH();
                        actualizaAsignar();
                        validavehiculo(params.mail);
                    } catch (s) { mens("Error servicio actualizar veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#mntVehiculosScreen"), false); return; }
                }
            },
            error: function (err) {
                mens("Error conexi" + String.fromCharCode(243) + "n servicio veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#mntVehiculosScreen"), false); return;
            }
        });
    } catch (e) { mens("Error servicio grabar veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#mntVehiculosScreen"), false); return; }
    kendo.ui.progress($("#mntVehiculosScreen"), false);
}

function borraVH() {
    document.getElementById("VIN").value = "";
    document.getElementById("AliasAD").value = "";
}

var grid;
function validavehiculo(email) {
    try {
        if ((email != "") && (email)) {
            var resultado = "";
            var Url = urlService + "Vehiculo/" + email;
            var grid = $("#chasisview").data("kendoGrid");
            $.ajax({
                url: Url, type: "GET", dataType: "json", async: false,
                success: function (data) {
                    try {
                        resultado = JSON.parse(data.VehiculoGetResult).Vehiculo;
                        var dataSource = new kendo.data.DataSource({
                            data: resultado
                        });
                        grid.setDataSource(dataSource);
                    } catch (e) { mens("Error servicio veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#mntVehiculosScreen"), false); return; }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#mntVehiculosScreen"), false); return;
                }
            });
            return resultado;
        }
    } catch (e) { mens("Error servicio veh" + String.fromCharCode(237) + "culo", "mens"); kendo.ui.progress($("#mntVehiculosScreen"), false); return; }
}
function grid_remove(e) {
    try {
        acepta = e;
        mensajePrmOpc("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
           "AVISO", "Esta seguro de borrar el registro<br><br>", true);
        /*var sino = confirm("Quieres borrar este registro?");
        
        if (sino == true) {
            var grid = $(e).closest('.k-grid').data('kendoGrid'); //get the grid
            var dataItem = grid.dataItem($(e).closest('tr'));
            actualiza("4;" + dataItem.mail + ";" + dataItem.chasis);
            if (dataItem.chasis == datos_Cliente.chasis) {
                datos_Cliente.chasis = "";
                datos_Cliente.alias = "";
                localStorage.setItem("Inp_DatosUsuario", JSON.stringify(datos_Cliente));
            }
        }*/
    } catch (s) { mens("Error al eliminar veh" + String.fromCharCode(237) + "culo", "mens"); return; }
}

function actualiza(chasisemail) {
    try {
        var Url = urlService + "EliminaV";
        var params = { "vin": chasisemail };
        $.ajax({
            url: Url, type: "POST", data: JSON.stringify(params), dataType: "json",//Content-Type: application/json
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            success: function (data) {
                if (data.substring(0, 1) == "0") {
                    if (data.substring(0, 1) == "0" || data.substring(0, 1) == "1") { data = data.substring(2, data.length); }
                    mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                    "Advertencia", "<span align='justify'>" + data + "</b></span>", true, true); return;
                } else {
                    mens("Se elimin" + String.fromCharCode(243) + " el registro", "mens");
                    actualizaAsignar();
                }
            },
            error: function (err) { mens("Error servicio actualizar veh" + String.fromCharCode(237) + "culo", "mens"); return; }
        });
    } catch (e) { mens("Error servicio eliminar veh" + String.fromCharCode(237) + "culo", "mens"); return; }
}
function onSI(e) {
    try {
        var grid = $(acepta).closest('.k-grid').data('kendoGrid'); //get the grid
        var dataItem = grid.dataItem($(acepta).closest('tr'));
        actualiza("4;" + dataItem.mail + ";" + dataItem.chasis);
        if (dataItem.chasis == datos_Cliente.chasis) {
            datos_Cliente.chasis = "";
            datos_Cliente.alias = "";       
            if (datos_Cliente.nombre_alias == document.getElementById("NumeroChasisRV").innerText) {
                datos_Cliente.nombre_alias = "";
                $("#NumeroChasisRV").text("");
            }
            localStorage.setItem("Inp_DatosUsuario", JSON.stringify(datos_Cliente));
        }
    }catch(e1){ mens("Error al borrar registro","mens");}
}

function onNO(e) {
    sino="NO";
    return;
}