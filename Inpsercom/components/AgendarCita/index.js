//'use strict';

app.mntAgendarCita = kendo.observable({
    onShow: function () {
        //$("#NumeroChasisCA").text(datos_Cliente.chasis);
        // RRP: alias - agendar cita
        $("#NumeroChasisCA").text(datos_Cliente.nombre_alias);
        var anch = screen.width;
        var height1 = (anch / 2) - 30;
        var urlImagenK = traeUrlsImagenes();
        
        //var url = ["http://www.kia.com/ec/showroom/picanto-r.html", "http://www.kia.com/ec/showroom/nuevo-rio-sedan.html",
        //    "http://www.kia.com/ec/showroom/nuevo-rio-hatchback/features.html", "http://www.kia.com/ec/showroom/nuevo-cerato.html", "http://www.kia.com/ec/showroom/cerato-forte.html",
        //    "http://www.kia.com/ec/showroom/cerato-koup.html", "http://www.kia.com/ec/showroom/kia-quoris.html"];
        //var imagenes = ["picantoxline.png", "riosedanxline.png", "riohatchbackline.png", "ceratoline.png", "ceratoForte.png", "ceratoKoup.png", "kiaQuoris.png"];
        var container = document.getElementById("contenedor");
        var tama = height1 + "px;";
        for (var i = 0; i < urlImagenK.length; i = i + 2) {
            var j = i + 1;
            var auto = "autokia" + i;
            var auto1 = "autokia" + j;
            if (j == urlImagenK.length) {
                container.innerHTML += "</br><div>&emsp;<a onclick='window.open(\"" + urlImagenK[i].CodigoClase + ",\"" + "_blank" + "\",\"" + "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400" + "\");'> <img id='" + auto + "' src='" + urlImagenK[i].NombreClase + "' style='border:3px solid white;' width='" + tama + "'> </a> &emsp;</div>";
            } else {
                container.innerHTML += "</br><div>&emsp;<a onclick='window.open(\"" + urlImagenK[i].CodigoClase + "\",\"" + "_blank" + "\",\"" + "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400" + "\");'> <img id='" + auto + "' src='" + urlImagenK[i].NombreClase + "' style='border:3px solid white;' width='" + tama + "'> </a>" +
                    "<a onclick='window.open(\"" + urlImagenK[j].CodigoClase + "\",\"" + "_blank" + "\",\"" + "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400" + "\");'> <img id='" + auto1 + "' src='" + urlImagenK[j].NombreClase + "' style='border:3px solid white;' width='" + tama + "'> </a> &emsp;</div>";
                //$(container).append('</br><div>&emsp;<a onclick="autoKia("' + urlImagenK[i].CodigoClase + '");"> <img id="' + auto + '" src="' + urlImagenK[i].NombreClase + '" style="border:3px solid white;" width="' + tama + '"> </a>' +
                //    '<a onclick="window.open("' + urlImagenK[j].CodigoClase + '", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");> <img id="' + auto1 + '" src="' + urlImagenK[j].NombreClase + '" style="border:3px solid white;" width="' + tama + '" > </a> &emsp;</div>');
            }
        }

    },
    afterShow: function () { },
    inicializa: function () {
    }
});
app.localization.registerView('mntAgendarCita');

function salirCompra() {
   $(contenedor).empty();
   kendo.mobile.application.navigate("components/MenuCompraKia/view.html");    
}

function traeUrlsImagenes() {
    var urlsImagen;
    try {
        var Url = "http://200.31.10.92:8092/appk_aekia/Services/TG/Parametros.svc/ComboParametroEmpGet/8,;TG;PROYECTO_APP_MODELOS";
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    urlsImagen = JSON.parse(data.ComboParametroEmpGetResult);
                } catch (e) {
                    mens("No existe datos para esta cosnulta", "mens"); return;
                }
            },
            error: function (err) {
                mens("Error en consulta", "mens"); return;
            }
        });
    } catch (e) {
        mens("Error de conexi" + String.fromCharCode(243) + "n a base", "mens"); return;
    }
    return urlsImagen;
}
