//'use strict';
var datos_Cliente, Device_identifier, datos_Vehiculo, urlService, observa, observa1, registrado;
var datos_sherloc = '';

var VersionHM = "";
var urlInterno = 'http://200.31.10.92:8092/appk_aekia/Services/SL/Sherloc/Sherloc.svc/';//'http://192.168.1.3:8089/biss.sherloc/Services/SL/Sherloc/Sherloc.svc/';  // 'http://192.168.1.3:8089';http://186.71.21.170:8089" + "/biss.sherloc/Services/SL/Sherloc/Sherloc.svc/Login/s@s.com;a 
var urlExterno = 'http://200.31.10.92:8092/appk_aekia/Services/SL/Sherloc/Sherloc.svc/';// 'http://186.71.21.170:8089/biss.sherloc/Services/SL/Sherloc/Sherloc.svc/';http://186.71.21.170:8089/biss.sherloc/Services/SL/Sherloc/Sherloc.svc/';
var urlImagen = '';// 'http://200.31.10.92:8092/appk_aekia/imagenes/';
var urlCitas = ''; // 'http://citatallerkia.com.ec/cliente/reservar-cita';
var urlColisiones = '';   // 'http://citatallerkia.com.ec/cliente/reservar-cita';
var urlsherlocMenu = ''; // 'http://190.110.193.131/ClienteService.svc/ClientProfile/';
var urlsherlocControl = ''; // 'http://190.110.193.131/ServiceERM.svc/EnviarMensaje/';
var urlsherlocH = ''; // 'http://190.110.193.131/ServiceERM.svc/Historico/';
var urlsherlocReport = ''; // 'http://190.110.193.131/ReportService.svc/';
var urlPdfInterno = '';
var urlPdfExterno = '';
var urlMenuAsistencia = ''; //'http://www.kia.com/ec/service/';
var urlMenuConcesionarios = '';
var urlCotizaRep = '';
var urlGarantiaKia = '';
var urlMantenimiento = '';
var urlSeminuevos = ''; //'https://www.seminuevos.com.ec/';
var varPuntosMapa = 0; //23;


//http://200.31.10.92:8092/appk_aekia/Services/SL/Sherloc/Sherloc.svc/
var notificationWidget;
(function () {
    var app = {
        data: {},
        localization: {
            defaultCulture: 'en',
            cultures: [{
                name: "English",
                code: "en"
            }]
        },
        navigation: {
            viewModel: kendo.observable()
        }
    };

    var bootstrap = function () {
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                skin: 'nova',
                initial: 'components/home/view.html'
            });

            kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });
    };

    $(document).ready(function () {
        notificationWidget = $("#notification").kendoNotification().data("kendoNotification");
        app.notification = $("#notify");

    });

    app.showNotification = function (message, time) {
        var autoHideAfter = time ? time : 3000;
        app.notification.find('.notify-pop-up__content').html(message);
        app.notification.fadeIn("slow").delay(autoHideAfter).fadeOut("slow");
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            var element = document.getElementById('appDrawer');
            if (typeof (element) != 'undefined' && element !== null) {
                if (window.navigator.msPointerEnabled) {
                    $('#navigation-container').on('MSPointerDown', 'a', function (event) {
                        app.keepActiveState($(this));
                    });
                } else {
                    $('#navigation-container').on('touchstart', 'a', function (event) {
                        app.keepActiveState($(this).closest('li'));
                    });
                }
            }

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function (url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function (itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function (event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function (formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function (key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function (widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function () {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
} ());

/// start app modules
(function localization(app) {
    var localization = app.localization = kendo.observable({
        cultures: app.localization.cultures,
        defaultCulture: app.localization.defaultCulture,
        currentCulture: '',
        strings: {},
        viewsNames: [],
        registerView: function (viewName) {
            app[viewName].set('strings', getStrings() || {});

            this.viewsNames.push(viewName);
        }
    }),
        i, culture, cultures = localization.cultures,
        getStrings = function () {
            var code = localization.get('currentCulture'),
                strings = localization.get('strings')[code];

            return strings;
        },
        updateStrings = function () {
            var i, viewName, viewsNames,
                strings = getStrings();

            if (strings) {
                viewsNames = localization.get('viewsNames');

                for (i = 0; i < viewsNames.length; i++) {
                    viewName = viewsNames[i];

                    app[viewName].set('strings', strings);
                }

                app.navigation.viewModel.set('strings', strings);
            }
        },
        loadCulture = function (code) {
            $.getJSON('cultures/' + code + '/app.json',
                function onLoadCultureStrings(data) {
                    localization.strings.set(code, data);
                });
        };

    localization.bind('change', function onLanguageChange(e) {
        if (e.field === 'currentCulture') {
            var code = e.sender.get('currentCulture');

            updateStrings();
        } else if (e.field.indexOf('strings') === 0) {
            updateStrings();
        } else if (e.field === 'cultures' && e.action === 'add') {
            loadCulture(e.items[0].code);
        }
    });

    for (i = 0; i < cultures.length; i++) {
        loadCulture(cultures[i].code);
    }

    localization.set('currentCulture', localization.defaultCulture);
})(window.app);

function inspeccionar(obj) {
    try {
        var msg = '';
        for (var property in obj) {
            if (typeof obj[property] == 'function') {
                var inicio = obj[property].toString().indexOf('function');
                var fin = obj[property].toString().indexOf(')') + 1;
                var propertyValue = obj[property].toString().substring(inicio, fin);
                msg += (typeof obj[property]) + ' ' + property + ' : ' + propertyValue + ' ;\n';
            } else if (typeof obj[property] == 'unknown') {
                msg += 'unknown ' + property + ' : unknown ;\n';
            } else {
                msg += (typeof obj[property]) + ' ' + property + ' : ' + obj[property] + ' ;\n';
            }
        }
        return msg;
    } catch (e) {
        alert(e);
    }
}
function beforeDrawerShow(e) {
    if ((e.view.currentView.id == "components/home/view.html") || (e.view.currentView.id == "components/logIn/view.html") || (e.view.currentView.id == "components/Registro/view.html")) {
        e.preventDefault();
    }
}

function mens(Mensaje, Tipo) {

    var valorIzq = (Mensaje.length) * 4;
    notificationWidget.setOptions({
        position: {
            top: Math.floor($(window).width() / 2),
            left: Math.floor($(window).width() / 2 - valorIzq),
            bottom: 0,
            right: 0
        },
        font: {
            size: 14,
            bold: true
        }
    });

    notificationWidget.showText(Mensaje, Tipo);
}

function mens2(Mensaje, Tipo) {
    var notificationElement = $("#notification");

    notificationElement.kendoNotification({
        templates: [{
            // define a custom template for the built-in "warning" notification type
            type: "warning",
            template: "<div class='myWarning' style='width:280px;'> #= myMessage #</div>"
        }, {
            // define a template for the custom "timeAlert" notification type
            type: "sucess",
            template: "<div class='mySucess' style='width:280px;'> #= myMessage #</div>"
            // template content can also be defined separately
            //template: $("#myAlertTemplate").html()
        }],
        autoHideAfter: 10000,
        position: {
            top: Math.floor($(window).width() / 2),
            left: Math.floor($(window).width() / 2 - 145),
            bottom: 0,
            right: 0
        },
        font: {
            size: 14,
            bold: true
        },


    });

    var n = notificationElement.data("kendoNotification");

    // show a warning message using the built-in shorthand method
    n.warning({
        myMessage: Mensaje
    });


}


/* -----------------------------------------------------------------------------------------------
RRP:            12-06-2017
Descripción:	Presenta mensajes parametrizados
--------------------------------------------------------------------------------------------------
Tipo:           timeAlert / warning / success / info / error 
Tiempo:         Tiempo de espera para el cierre automatico (1000 = 1 seg. / 0 = no se oculta)
Logo:           Dirección del logotipo (path)
Mensaje:        Texto del mensaje, admite formato HTML
Cerrar:         Agrega el boton cerrar haya o no Tiempo de espera
-------------------------------------------------------------------------------------------------*/

function mensajePrm(Tipo, Tiempo, Logo, Titulo, Mensaje, Cerrar, Cerrar1) {
    try {
        var notificationElement = $("#notification");

        var ocultaClick = false;
        if (Tiempo == 0 || Cerrar == true) {
            ocultaClick = true;
        }
        notificationElement.kendoNotification({
            templates: [{
                // define a custom template for the built-in "warning" notification type
                type: "timeAlert",
                template: "<div class='mytimeAlert' style='width:280px;'> #= myMessage #</div>"
            }],
            autoHideAfter: Tiempo, // tiempo para ocultar automaticamente
            hideOnClick: ocultaClick, // Desactiva ocultar al hacer click        
            position: {
                top: Math.floor($(window).width() / 2),
                left: Math.floor($(window).width() / 2 - 140),
                bottom: 0,
                right: 0
            }
        });

        var n = notificationElement.data("kendoNotification");

        // El mensaje se inserta en una tabla y centrado
        Mensaje = "<table width='100%' border='0'><tr><td>&nbsp</td><td align='justify'><div style='overflow: scroll;'>" + Mensaje + "</div></td><td>&nbsp</td></tr></table>";

        // Recibe el path del logo seleccionado
        Logo = "<table width='100%' border='0'><tr><td>&nbsp;</td></tr><tr><td></td><td align='lefth'>" + Logo + "</td></tr></table> ";

        // Titulo en negrilla y centrado
        Titulo = "<table width='100%' border='0'><tr><td align='center'><font style='font-weight: bold; font-size: 20px;'>" + Titulo + "</font></td></tr></table>";

        // Composición del mensaje
        Mensaje = Logo + Titulo + Mensaje;

        // Si envia "1" presenta el boton CERRAR
        var botCerrar = "<table width='100%' border='0'><tr><td align='center'><input name='cmdCerrar' type='button' class='k-button fondoRojoLogin' value='Cerrar' id='cmdCerrar'/></td></tr></table>";
        //var botCerrar1 = "<table width='100%' border='0'><tr><td align='center'><input name='cmdCerrar1' type='button' class='k-button fondoRojoLogin' value='CERRAR1' id='cmdCerrar1'/></td></tr></table>";
        //if (Cerrar1==true){return true;}
        if (Tiempo == 0 || Cerrar == true)
            Mensaje += botCerrar;

        Mensaje += "<table width='100%' border='0'><tr><td align='center'>&nbsp;</td></tr></table>";

        if (Tipo == "info") {
            n.info({ myMessage: Mensaje });
        }
        else if (Tipo == "warning") {
            n.warning({ myMessage: Mensaje });
        }
        else if (Tipo == "success") {
            n.success({ myMessage: Mensaje });
        }
        else if (Tipo == "error") {
            n.error({ myMessage: Mensaje });
        }
        else if (Tipo == "timeAlert") {
            n.show({ time: new Date().toLocaleTimeString(), myMessage: Mensaje }, "timeAlert");
        }
        else {
            n.show({ myMessage: Mensaje });
        }
    } catch (j) {
        mens("Error en mensaje", "mens");
    }
}

function mensajePrmOpc(Tipo, Tiempo, Logo, Titulo, Mensaje, Cerrar) {

    var notificationElement = $("#notification");

    var ocultaClick = false;
    if (Tiempo == 0 || Cerrar == true)
        ocultaClick = true;

    notificationElement.kendoNotification({
        templates: [{
            // define a custom template for the built-in "warning" notification type
            type: "timeAlert",
            template: "<div class='mytimeAlert' style='width:280px;'> #= myMessage #</div>"
        }],
        autoHideAfter: Tiempo, // tiempo para ocultar automaticamente
        hideOnClick: ocultaClick, // Desactiva ocultar al hacer click        
        position: {
            top: Math.floor($(window).width() / 2),
            left: Math.floor($(window).width() / 2 - 140),
            bottom: 0,
            right: 0
        }
    });

    var n = notificationElement.data("kendoNotification");

    // El mensaje se inserta en una tabla y centrado
    Mensaje = "<table width='100%' border='0'><tr><td>&nbsp</td><td align='justify'>" + Mensaje + "</td><td>&nbsp</td></tr></table>";

    // Recibe el path del logo seleccionado
    Logo = "<table width='100%' border='0'><tr><td>&nbsp;</td></tr><tr><td></td><td align='lefth'>" + Logo + "</td></tr></table> ";

    // Titulo en negrilla y centrado
    Titulo = "<table width='100%' border='0'><tr><td align='center'><font style='font-weight: bold; font-size: 20px;'>" + Titulo + "</font></td></tr></table>";

    // Composición del mensaje
    Mensaje = Logo + Titulo + Mensaje;

    // Si envia "1" presenta el boton CERRAR
    var botCerrar = "<table width='100%' border='0'><tr><td align='center'><a onclick='onSI()' style='font: bold 14px Arial; text-decoration: none; background-color: #EEEEEE; color: #333333;  padding: 2px 6px 2px 6px;  border-top: 1px solid #CCCCCC;  border-right: 1px solid #333333;  border-bottom: 1px solid #333333;  border-left: 1px solid #CCCCCC;'>SI</a>&nbsp;&nbsp;<a onclick='onNO()' style='font: bold 14px Arial; text-decoration: none; background-color: #EEEEEE; color: #333333;  padding: 2px 6px 2px 6px;  border-top: 1px solid #CCCCCC;  border-right: 1px solid #333333;  border-bottom: 1px solid #333333;  border-left: 1px solid #CCCCCC;'>NO</a></td></tr></table>";

    //  if(Tiempo == 0 || Cerrar == true)
    Mensaje += botCerrar;

    Mensaje += "<table width='100%' border='0'><tr><td align='center'>&nbsp;</td></tr></table>";

    if (Tipo == "info") {
        n.info({ myMessage: Mensaje });
    }
    else if (Tipo == "warning") {
        n.warning({ myMessage: Mensaje });
    }
    else if (Tipo == "success") {
        n.success({ myMessage: Mensaje });
    }
    else if (Tipo == "error") {
        n.error({ myMessage: Mensaje });
    }
    else if (Tipo == "timeAlert") {
        n.show({ time: new Date().toLocaleTimeString(), myMessage: Mensaje }, "timeAlert");
    }
    else {
        n.show({ myMessage: Mensaje });
    }
}
