//'use strict';
var validaLog;
registrado = "false";
app.home = kendo.observable({
    onShow: function () {
        try {
            kendo.ui.progress($("#homeScreen"), true);
             setTimeout(2000);
            validaLog = "false";
            //window.localStorage.clear();
            //return;
            $("#versionHM").text("Kia Ecuador "+VersionHM);
            Device_identifier = device.uuid;
            try {
                consultarSherloc();
                consultarlinkMenu();
                //var Usuario = {
                //    chasis: "8LGJE5520CE010039",
                //    identificacion_cliente: "0992327685001",
                //    tipodocumento: "R",
                //    uid: "1234567890", // usu.Cliente[0].alta_movil_imei,
                //    telefono_celular: "0995545554",
                //    //numeroorden: "72363",
                //    secuencia_mv01: "1",
                //    mail: "vinicio.ortega@inpsercom.com",
                //    nombre_alias: "SPORTAGE ACTIVE",
                //    pas: "cbQkjinclzndnndk",
                //    path_prefactura: "http://186.71.68.154:8089/PDF_OT/ASIAU_02_02_20170538.PDF", 
                //    mail_cajero: "",
                //    codigo: "3314"
                //};
                //localStorage.setItem("Inp_DatosUsuario", JSON.stringify(Usuario));
                var verific = validaLoginPrueba();
                if (verific == false) {
                    urlService = urlInterno;
                } else { urlService = urlExterno; }
                localStorage.setItem("urlService", urlService);
            } catch (e) { mens("No existe conexi" + String.fromCharCode(243) + "n con el servidor ", "mens"); return; }

        } catch (e) { mens("Error lectura ip", "mens"); kendo.ui.progress($("#homeScreen"), false); return; }
        try {
            if (localStorage.getItem("Inp_DatosUsuario")) {
                datos_Cliente = JSON.parse(localStorage.getItem("Inp_DatosUsuario"));
                datos_Vehiculo = JSON.parse(localStorage.getItem("Inp_DatosVehiculo"));
                validaLog = validaLoginL(datos_Cliente.mail, datos_Cliente.pas, datos_Cliente.codigo)
                if (validaLog == "true") {
                    registrado = "true";
                    //kendo.mobile.application.navigate("components/MenuKia/view.html");
                }
                else {
                    registrado = "flase";
                    mens("Cliente no registrado", "mens");
                }
                //kendo.mobile.application.navigate("components/MenuKia/view.html");
            }
        } catch (f) { mens("Error en conexi" + String.fromCharCode(243) + "n a la base", "mens"); kendo.ui.progress($("#homeScreen"), false); return; }
        kendo.ui.progress($("#homeScreen"), false);
    },
    init: function () {
        kendo.ui.progress($("#homeScreen"), true);
        datos_Cliente = JSON.parse(localStorage.getItem("Inp_DatosUsuario"));
        urlService = urlExterno;
        if (localStorage.getItem("Inp_DatosUsuario")) {
            datos_Cliente = JSON.parse(localStorage.getItem("Inp_DatosUsuario"));
            datos_Vehiculo = JSON.parse(localStorage.getItem("Inp_DatosVehiculo"));
            var validaLog1 = validaLoginL(datos_Cliente.mail, datos_Cliente.pas, datos_Cliente.codigo)
            if (validaLog1 == "true") {
                registrado = "true";
                kendo.mobile.application.navigate("components/MenuKia/view.html");
            }
            else {
                registrado = "false";
                mens("Cliente no registrado", "mens");
            }
            
        } kendo.ui.progress($("#homeScreen"), false);
    },
    beforeShow: function () { }
});
app.localization.registerView('home');

function LoginVehiculo() {
    registrado = "true";
    //alert(registrado);
    kendo.mobile.application.navigate("components/logIn/view.html");
}

function RegistroVehiculo(){
    kendo.mobile.application.navigate("components/Registro/view.html");
}

function regresaHME(){
    try {
        //alert(validaLog);
        if (validaLog == "true") {
            kendo.mobile.application.navigate("components/MenuKia/view.html");
        }
        else {
            mens("No ha registrado un usuario aun", "mens");
        }
    } catch (e) { mens("Error al cargar men" + String.fromCharCode(250) + "", "mens"); return; }
}

//190.108.66.10
function validaLoginPrueba() {
    try{
    var Url = urlExterno + "Login/vinicio.ortega@inpsercom.com.com;a;3314"; 
    
    $.ajax({
        url: Url,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            resultado = data.LoginGetResult;
        },
        error: function (err) {
            if (err.statusText.substr(0, 31) == "NetworkError: Failed to execute") {
                resultado = false;
                return resultado;
            }
        }
    });
    } catch (e) { mens("Error conexi" + String.fromCharCode(243) + "n login", "mens"); return; }
    return resultado;
}

function consultarlinkMenu() {
    var inforS;
    try {
        var Url = "http://200.31.10.92:8092/appk_aekia/Services/TG/Parametros.svc/ComboParametroEmpGet/7,;TG;PROYECTO_APP_MENU";
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforS = JSON.parse(data.ComboParametroEmpGetResult);
                    
                    for (var i = 0; i < inforS.length; i++) {
                        if (inforS[i].CodigoClase == "ASISTENCIA") {
                            urlMenuAsistencia = inforS[i].NombreClase;
                        } else {
                            if (inforS[i].CodigoClase == "CONCESIONARIOS") {
                                urlMenuConcesionarios = inforS[i].NombreClase;
                            } else {
                                if (inforS[i].CodigoClase == "COTIZAREP") {
                                    urlCotizaRep = inforS[i].NombreClase;
                                } else {
                                    if (inforS[i].CodigoClase == "GARANTIAKIA") {
                                        urlGarantiaKia = inforS[i].NombreClase;
                                    } else {
                                        if (inforS[i].CodigoClase == "MANTENIMIENTO") {
                                            urlMantenimiento = inforS[i].NombreClase;
                                        } else {
                                            if (inforS[i].CodigoClase == "SEMINUEVOS") {
                                                urlSeminuevos = inforS[i].NombreClase;
                                            } 
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    mens("No existe datos para esta cosnulta", "mens"); return;
                }
            },
            error: function (err) {
                mens("Error en consulta", "mens"); return;
            }
        });
    } catch (errr) {
        mens("Error de conexi" + String.fromCharCode(243) + "n a base", "mens"); return;
    }
}

function consultarSherloc() {
    var inforS;
    try {
        var Url = "http://200.31.10.92:8092/appk_aekia/Services/TG/Parametros.svc/ComboParametroEmpGet/7,;TG;PROYECTO_APP_SHERLOC";
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforS = JSON.parse(data.ComboParametroEmpGetResult);

                    for (var i = 0; i < inforS.length; i++) {
                        if (inforS[i].CodigoClase == "CLIENTE") {
                            urlsherlocMenu = inforS[i].NombreClase;
                        } else {
                            if (inforS[i].CodigoClase == "CONTROL") {
                                urlsherlocControl = inforS[i].NombreClase;
                            } else {
                                if (inforS[i].CodigoClase == "HISTORICO") {
                                    urlsherlocH = inforS[i].NombreClase;
                                } else {
                                    if (inforS[i].CodigoClase == "CITAS") {
                                        urlCitas = inforS[i].NombreClase;
                                    } else {
                                        if (inforS[i].CodigoClase == "COLISIONES") {
                                            urlColisiones = inforS[i].NombreClase;
                                        } else {
                                            if (inforS[i].CodigoClase == "PDF_INTERNO") {
                                                urlPdfInterno = inforS[i].NombreClase;
                                            } else {
                                                if (inforS[i].CodigoClase == "PDF_EXTERNO") {
                                                    urlPdfExterno = inforS[i].NombreClase;
                                                } else {
                                                    if (inforS[i].CodigoClase == "PUNTOSMAPA") {
                                                        varPuntosMapa = parseInt(inforS[i].NombreClase);
                                                    } else {
                                                        urlsherlocReport = inforS[i].NombreClase;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                } catch (e) {
                    mens("No existe datos para esta cosnulta", "mens"); return;
                }
            },
            error: function (err) {
                mens("Error en consulta", "mens"); return;
            }
        });
    } catch (errr) {
        mens("Error de conexi" + String.fromCharCode(243) + "n a base", "mens"); return;
    }
}

function validaLoginL(email, password, codigo) {
    try {
        var resultadoL = "";
        var _identificacion = email + ";" + password + ";" + codigo;
        //_identificacion="7,vinicio.ortega@inpsercom.com;;http://186.71.68.154:8090/prefactura_taller/DEBITOCONFIAMED2015.pdf"
        if ((_identificacion !== "") && (_identificacion)) {
            resultadoL = "";
            var Url = urlService + "Login/" + _identificacion;
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        resultadoL = data.LoginGetResult;
                    } catch (e) {
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                            "ERROR", "<span align='justify'>" + data + "</b></span>", true, true);
                        borraCamposLogin(); return;
                    }
                },
                error: function (err) {
                    mens("Error en conexi" + String.fromCharCode(243) + "n al servicio login", "mens"); return;
                }
            });
            return (resultadoL);
        }
    } catch (f) {
        mens("Error cenexi" + String.fromCharCode(243) + "n servicio login", "mens"); return;
    }
}
function salirH() {
    mens("Cerrando la Aplicacion", "mens"); 
    localStorage.removeItem("Inp_DatosUsuario");
    localStorage.removeItem("Inp_DatosVehiculo");
    validaLog = false;
    navigator.app.exitApp();
}