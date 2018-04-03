//'use strict';
var persona_numero = "0";
app.miKia6 = kendo.observable({
    onShow: function () {
        try {
            var fecha = new Date();
            //borraCamposRE();
            //document.getElementById("identificacion").value = "";
            var year = fecha.getFullYear() - 18;
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            $("#FechaNacimiento").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                max: new Date(year, mes, dia),
                format: "yyyy-MM-dd"
            });
            document.getElementById("btnRegistrar").disabled = false;
            //document.getElementById("FechaNacimiento").value = (year + "-" + (mes + 1) + "-" + dia);
        } catch (e) { mens("Error en formato fecha", "mens"); return; }
    },
    afterShow: function () { }
});
app.localization.registerView('miKia6');
function llamarregistro() {
    kendo.ui.progress($("#miKia6Screen"), true);
    setTimeout(function () {
        registrarRN();
    }, 2000);
}
function terminosC() {
    kendo.mobile.application.navigate("components/TerminosCondiciones/view.html");
}
function validacedula(cedula) {
    try {
        var verificado = "false";
        var total = 0;
        var isNumeric;
        var coeficiente = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        if (cedula.length == 10) {
            if (cedula.substring(0, 2) <= 24 && cedula.substring(0, 2) > 0) {
                var digito = cedula.substr(9, 1);
                for (var k = 0; k < coeficiente.length; k++) {
                    var valor = coeficiente[k] * cedula[k];
                    if (valor > 9) {
                        valor = valor - 9;
                    }
                    total = total + valor;
                }
                if (total > 9) {
                    total = total % 10;
                }
                var digi = 10 - total;
                if (digito == digi) { verificado = "true"; }
            }
        }
    } catch (e) {mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
            "ERROR", "<span align='justify'>" + e + "</b></span>", true, true);
    }
    return verificado;
}
function personaGetReg() {
    try {
        var _identificacion = document.getElementById("identificacion").value;
        if ((_identificacion != "") && (_identificacion)) {
            //var validaced = validacedula(_identificacion);
            //if (validaced == "false") { mens("Cedula incorrecta", "mens");document.getElementById("identificacion").focus();  return; }
            var Url = urlService + "json/" + _identificacion;
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        data = JSON.parse(data.PersonaGetResult);
                        if (data.persona_nombre) {
                            document.getElementById("Nombres").value = data.persona_nombre;
                            document.getElementById("Apellidos").value = data.persona_apellido;
                            document.getElementById("email").value = "";//data.mail;
                            document.getElementById("FechaNacimiento").value = data.fecha_nacimiento;
                            document.getElementById("celular").value = data.telefono_celular;
                            persona_numero = data.persona_numero;
                        } else {
                            borraCamposRE();
                            mens("Error no existe persona", "mens");
                            //borraCamposRE();
                            return;
                        }
                    } catch (e) {
                        mens("Error consulta cliente", "mens");
                        borraCamposRE();
                        return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio clientes", "mens"); return;
                }
            });
        }
    } catch (e) {
        mens("Error servicio clientes", "mens"); return;
    }
}


function registrarRN() {
    try {
        var identificacion = document.getElementById("identificacion").value;
        var Nombres = document.getElementById("Nombres").value;
        var Apellidos = document.getElementById("Apellidos").value;
        var email = document.getElementById("email").value;
        var chasis = document.getElementById("Chasis").value;
        var alias = document.getElementById("Alias").value;
        var alias1 = document.getElementById("Alias").value;
        var FechaNacimiento = document.getElementById("FechaNacimiento").value;
        var celular = document.getElementById("celular").value;
        var password = document.getElementById("password").value;
        var repassword = document.getElementById("repassword").value;
        var numorden = 0; //document.getElementById("numorden").value;
        var Url = urlService + "ClienteSet";
        var params = {
            "secuencia_mv01": 3,
            "identificacion_cliente": identificacion,
            "persona_nombre": Nombres,
            "persona_apellido": Apellidos,
            "mail": email,
            "chasis": chasis.toUpperCase(),
            "nombre_alias": alias,
            "fecha_nacimiento": FechaNacimiento,
            "telefono_celular": celular,
            //"numeroorden": numorden,
            "password": password,
            "persona_numero": persona_numero
            //"alta_movil_imei": Device_identifier
            //output: "json"
        };
        var indicador = 0;
        $.each(params, function (k, v) {
            //display the key and value pair
          
            if (k != "nombre_alias") {
                if (v == "") {
                    indicador = 1;                    
                }
            }

            /*           if (v == "") {
                           indicador = 1;
                           //alert(k + ' esta en blanco ' + v);
                       }
           */
        });
        if (indicador == 1) {
            mens("Verificar datos en blanco", "mens"); kendo.ui.progress($("#miKia6Screen"), false); return;
        }
        if (document.getElementById("cbkterminos").checked == false) { mens("Debe aceptar terminos y condiciones", "mens"); kendo.ui.progress($("#miKia6Screen"), false); return; }
        $.ajax({
            url: Url,
            type: "POST",
            data: JSON.stringify(params),
            async: false,
            dataType: "json",
            //Content-Type: application/json
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (data) {
                if (data.substring(0, 1) == "0") {
                    if (data.substring(0, 1) == "0" || data.substring(0, 1) == "1") { data = data.substring(2, data.length); }
                    mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                    "Advertencia", "<span align='justify'>" + data + "</b></span>", true, true); kendo.ui.progress($("#miKia6Screen"), false); return;
                }else {
                    try {
                        mens("Registro Exitoso", "success");
                        sessionStorage.setItem("Registro", params);
                        var em = params.mail;
                        var usu = validausuarioREG(em); //resultado.Cliente[0].persona_nombre
                        var tipo = "";
                        if (usu.Cliente[0].identificacion_cliente.length == 10) { tipo = "C"; }
                        else {
                            if (usu.Cliente[0].identificacion_cliente.length == 13) { tipo = "R"; }
                            else { tipo = "P"; }
                        }
                        var Usuario = {
                            chasis: usu.Cliente[0].chasis,//"8LGJE5520CE010039",
                            alias: usu.Cliente[0].nombre_alias,
                            identificacion_cliente: usu.Cliente[0].identificacion_cliente,  //"0992327685001",
                            tipodocumento: tipo, //"R",
                            uid: "1234567890", // usu.Cliente[0].alta_movil_imei,
                            telefono_celular: usu.Cliente[0].telefono_celular, //"0995545554",
                            //numeroorden: "72363",
                            secuencia_mv01: usu.Cliente[0].secuencia_mv01,
                            mail: usu.Cliente[0].mail,
                            pas: usu.Cliente[0].password,
                            mail_cajero: usu.Cliente[0].mail_cajero,
                            codigo: usu.Cliente[0].codigo_temporal,
                            codigo_consecionario: ""
                        };
                        localStorage.setItem("Inp_DatosUsuario", JSON.stringify(Usuario));
                        datos_Cliente = Usuario;
                        var veh = validavehicu(em);
                        if (veh == "" || veh == null || !(veh)) { mens("Registre autos", "warning"); }
                        else {
                            veh = veh.Vehiculo[0];
                            var Vehiculo = {
                                secuencia_mv01: veh.secuencia_mv01, //6,
                                mail: veh.mail, //"nerycarmela@hotmail.com",
                                chasis: veh.chasis, //"19JJDSXSMLSLXS",
                                alias: veh.nombre_alias,
                                numeroorden: veh.numeroorden,
                                contrato_tipo: veh.contrato_tipo, //"",
                                contrato_estado: veh.contrato_estado, //false,
                                contrato_fecha_desde: veh.contrato_fecha_desde, //"1900-01-01",
                                contrato_fecha_hasta: veh.contrato_fecha_hasta, //"1900-01-01",
                                estado_vh02: veh.estado_vh02, //false,
                                alta_movil_imei: veh.alta_movil_imei, // "",
                                alta_movil_ip: veh.alta_movil_ip // ""
                            }
                            localStorage.setItem("Inp_DatosVehiculo", JSON.stringify(Vehiculo));
                            datos_Vehiculo = Vehiculo;
                        }
                        //kendo.mobile.application.navigate("components/miKia/view.html");
                        borraCamposRE();
                        registrado = "false";
                        kendo.ui.progress($("#miKia6Screen"), false);
                        kendo.mobile.application.navigate("components/logIn/view.html");
                        return;
                    } catch (s) { mens("Error servicio cliente", "mens"); kendo.ui.progress($("#miKia6Screen"), false); return; } //alert (s); 
                }
            },
            error: function (err) { mens("Error en servicio clientes", "mens"); kendo.ui.progress($("#miKia6Screen"), false); return; } //alert(err);
        });
    } catch (e) { mens("Error en el servicio clientes", "mens"); kendo.ui.progress($("#miKia6Screen"), false); return; } //aler(e);
    kendo.ui.progress($("#miKia6Screen"), false);
}

function ValidaMailRegistro() {
    try {
        if (document.getElementById("email").value != "") {
            var result = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(document.getElementById("email").value);

            if (result == false) {
                document.getElementById("email").focus();
                document.getElementById("email").style.borderColor = "red";
            } else {
                document.getElementById("email").style.borderColor = "";
            }
        }
    } catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n mail", "mens"); return; }
}
function ValidaCelular() {
    try {
        if (document.getElementById("celular").value != "") {
            var result = /[09][0-9]{9}$/.test(document.getElementById("celular").value);
            if (result == false) {
                document.getElementById("celular").focus();
                document.getElementById("celular").style.borderColor = "red";
            } else {
                document.getElementById("celular").style.borderColor = "";
            }
        }
    }
    catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n celular", "mens"); return; }
}
function ValidaPassword() {
    var pass = document.getElementById("password").value;
    var repass = document.getElementById("repassword").value;
    if (pass == repass) {
        document.getElementById("btnRegistrar").disabled = false;
        document.getElementById("repassword").style.borderColor = "";
    }
    else {
        document.getElementById("btnRegistrar").disabled = true;
        document.getElementById("repassword").style.borderColor = "red";
    }
}

function borraCamposRE() {
    document.getElementById("Nombres").value = "";
    document.getElementById("Apellidos").value = "";
    document.getElementById("email").value = "";
    document.getElementById("Chasis").value = "";
    document.getElementById("Alias").value = "";
    document.getElementById("FechaNacimiento").value = "";
    document.getElementById("celular").value = "";
    document.getElementById("password").value = "";
    document.getElementById("repassword").value = "";
    document.getElementById("terminos").checked = false;
}

function validausuarioREG(email) {
    try {
        if ((email != "") && (email)) {
            var resultado = "";
            var Url = urlService + "Usuario/" + email;
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        resultado = JSON.parse(data.UsuarioGetResult);
                    } catch (e) {
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                      "ERROR", "<span align='justify'>" + data + "</b></span>", true, true); kendo.ui.progress($("#miKia6Screen"), false);
                        return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio Usuario", "mens"); kendo.ui.progress($("#miKia6Screen"), false); return;
                }
            });
            kendo.ui.progress($("#miKia6Screen"), false);
            return resultado;
        }
    } catch (f) {
        mens("Error conexi" + String.fromCharCode(243) + "n servicio Usuario", "mens"); kendo.ui.progress($("#miKia6Screen"), false); return;
    }
}
