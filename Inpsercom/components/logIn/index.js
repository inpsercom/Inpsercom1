//'use strict';
app.logIn = kendo.observable({
    onShow: function () {
        try {

            document.getElementById("emailLogin").value = "";
            document.getElementById("passwordLogin").value = "";
            //alert(registrado);
            if (registrado == "true") {
                document.getElementById("codigoLogin").style.display = "none";
                document.getElementById("codigoLogin").value = "0";
            } else {
                document.getElementById("codigoLogin").style.display = "block";
                document.getElementById("codigoLogin").value = "";
            }
            
            if (localStorage.getItem("Inp_DatosUsuario") == "" || localStorage.getItem("Inp_DatosUsuario") == null) {
                document.getElementById("passwordLogin").value = "";
            } else {
                datos_Cliente = JSON.parse(localStorage.getItem("Inp_DatosUsuario"));
                document.getElementById("emailLogin").value = datos_Cliente.mail;
                //document.getElementById("passwordLogin").value = datos_Cliente.pas;
                document.getElementById("passwordLogin").focus();
            }
        } catch (e) { mens("Error en datos usuario registrese","mens"); }
    },
    afterShow: function () { }
});
app.localization.registerView('logIn');
function llamarmailCT() {
    kendo.ui.progress($("#logInScreen"), true);
    setTimeout(function () {
        signin();
    }, 2000);
}

function signin() {
    try {
        var em = document.getElementById("emailLogin").value;
        var pa = document.getElementById("passwordLogin").value;
        var co = document.getElementById("codigoLogin").value;
        if (em == "" || !em) { mens("El Email no tiene datos", "mens"); kendo.ui.progress($("#logInScreen"), false); return; }
        if (pa == "" || !pa) { mens("El Password no tiene datos", "mens"); document.getElementById("passwordLogin").focus(); kendo.ui.progress($("#logInScreen"), false); return; }
        if (co == "" || !co) { mens("El C" + String.fromCharCode(243) + "digo no tiene datos", "mens"); document.getElementById("codigoLogin").focus(); kendo.ui.progress($("#logInScreen"), false); return; }
        var resul = validaLogin(document.getElementById("emailLogin").value, document.getElementById("passwordLogin").value, document.getElementById("codigoLogin").value);
        if (resul == "false" || resul == "" || !resul) {
            mens("Datos incorrectos por favor verifique", mens);
            borraCamposLogin();
            kendo.ui.progress($("#logInScreen"), false);
            return;
        } else {
            if (resul == "code") {
                mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                "ERROR", "<span align='justify'>Por favor ingresar el codigo de verificacion que le llego a su correo registrado</b></span>", true, true);
                document.getElementById("codigoLogin").style.display = "block";
                document.getElementById("codigoLogin").value = "";
                kendo.ui.progress($("#logInScreen"), false);
                return;
            }
        }
        var usu = validausuario(em); //resultado.Cliente[0].persona_nombre
        if (usu.Cliente[0].cerror == "0,Cambio de clave") {
            mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                "ERROR", "<span align='justify'>El password es provicional, por favor realizar cambio de clave</b></span>", true, true);
            borraCamposLogin(); kendo.ui.progress($("#logInScreen"), false); return;
        }
        var tipo = "";
        if (usu.Cliente[0].identificacion_cliente.length == 10) { tipo = "C"; }
        else {
            if (usu.Cliente[0].identificacion_cliente.length == 13) { tipo = "R"; }
            else { tipo = "P"; }
        }
        var Usuario = {
            chasis: usu.Cliente[0].chasis,//"8LGJE5520CE010039",
            identificacion_cliente: usu.Cliente[0].identificacion_cliente,  //"0992327685001",
            identificacion_flota: usu.Cliente[0].identificacion_flota,
            tipodocumento: tipo, //"R",
            uid: "1234567890", // usu.Cliente[0].alta_movil_imei,
            telefono_celular: usu.Cliente[0].telefono_celular, //"0995545554",
            //numeroorden: "72363",
            secuencia_mv01: usu.Cliente[0].secuencia_mv01,
            mail: usu.Cliente[0].mail,
            nombre_alias: usu.Cliente[0].nombre_alias,
            pas: pa, //usu.Cliente[0].password,
            mail_cajero: usu.Cliente[0].mail_cajero,
            codigo: usu.Cliente[0].codigo_temporal,
            codigo_consecionario:""
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
                numeroorden: veh.numeroorden,
                contrato_tipo: veh.contrato_tipo, //"",
                contrato_estado: veh.contrato_estado, //false,
                contrato_fecha_desde: veh.contrato_fecha_desde, //"1900-01-01",
                contrato_fecha_hasta: veh.contrato_fecha_hasta, //"1900-01-01",
                estado_vh02: veh.estado_vh02, //false,
                alta_movil_imei: veh.alta_movil_imei, // "",
                alta_movil_ip: veh.alta_movil_ip, // ""
                nombre_alias: veh.nombre_alias,
                placa: veh.placa,
                identificacion_cliente: veh.identificacion_cliente,
                identificacion_flota: veh.identificacion_flota,
                terminos: "no" //acepta terminos
            }
            localStorage.setItem("Inp_DatosVehiculo", JSON.stringify(Vehiculo));
            datos_Vehiculo = Vehiculo;
        }
        kendo.ui.progress($("#logInScreen"), false);
        //kendo.mobile.application.navigate("components/miKia/view.html");
        kendo.mobile.application.navigate("components/MenuKia/view.html");
    } catch (s) {
        mens("Error conexi" + String.fromCharCode(243) + "n a la base de datos ", "mens"); kendo.ui.progress($("#logInScreen"), false); return;
    }
    kendo.ui.progress($("#logInScreen"), false);
}

//190.108.66.10  urlService
function validaLogin(email, password, codigo) {
    try {
        var resultado = "";
        var _identificacion = email + ";" + password + ";" + codigo;
        //_identificacion="7,vinicio.ortega@inpsercom.com;;http://186.71.68.154:8090/prefactura_taller/DEBITOCONFIAMED2015.pdf"
        if ((_identificacion !== "") && (_identificacion)) {
            resultado = "";
            //var Url = urlService + "Login/" + _identificacion;
            var Url = urlService + "Login/" + _identificacion;
            //alert(Url);
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        resultado = data.LoginGetResult;
                    } catch (e) {
                        //alert(e);
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                            "ERROR", "<span align='justify'>" + data + "</b></span>", true, true);
                        borraCamposLogin(); return;
                    }
                },
                error: function (err) {
                    mens("Error en conexi" + String.fromCharCode(243) + "n al servicio login", "mens"); return;
                }
            });
            return resultado;
        }
    } catch (f) {
        mens("Error cenexi" + String.fromCharCode(243) + "n servicio login", "mens"); return;
    }
}

function validausuario(email) {
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
                            "ERROR", "<span align='justify'>" + data + "</b></span>", true, true);
                        borraCamposLogin(); return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio Usuario", "mens"); return;
                }
            });
            return resultado;
        }
    } catch (f) {
        mens("Error conexi" + String.fromCharCode(243) + "n servicio Usuario", "mens"); return;
    }
}

function validavehicu(emailp) {
    try {
        if ((emailp !== "") && (emailp)) {
            var resultado = "";
            var Url = urlService + "Vehiculo/" + emailp;
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        resultado = JSON.parse(data.VehiculoGetResult);
                    } catch (e) {
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                            "ERROR", "<span align='justify'>" + data + "</b></span>", true, true);
                        borraCamposLogin(); return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); return;

                }
            });
            return resultado;
        }
    } catch (f) {
        mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); return;
    }
}

function borraCamposLogin() {
    document.getElementById("emailLogin").value = "";
    document.getElementById("passwordLogin").value = "";
    if (registrado == "true") {
        document.getElementById("codigoLogin").value = "0";
    } else {
        document.getElementById("codigoLogin").value = "";
    }
    
    document.getElementById("emailLogin").focus();
}

function ValidaMailLogin() {
    try {
        if (document.getElementById("emailLogin").value != "") {
            var result = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(document.getElementById("emailLogin").value);
            if (result == false) {
                document.getElementById("emailLogin").style.borderColor = "red";
            } else {
                document.getElementById("emailLogin").style.borderColor = "";
                document.getElementById("passwordLogin").focus();
            }
        }
    } catch (f) {
        mens("Error validaci" + String.fromCharCode(243) + "n del mail", "mens"); return;
    }
}