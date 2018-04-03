app.pdfMP = kendo.observable({
    onShow: function () {
        $("#NumeroChasispdfMP").text(datos_Cliente.nombre_alias);
        var alto = screen.height - 160;
        var ancho = screen.width - 10;
        document.getElementById("ifmPdfMP").setAttribute('style', 'display: block');
        document.getElementById("ifmPdfMP").style.width = ancho + "px";
        document.getElementById("ifmPdfMP").style.height = alto + "px";
        var diip = "http://200.31.10.92:8092/appk_aekia/mantenimientos_prepagados_kia.pdf";
        dp = "https://docs.google.com/viewer?url=" + diip + "&embedded=true";
        document.getElementById("ifmPdfMP").src = dp;
        kendo.ui.progress($("#pdfMPScreen"), false);
    }
});
app.localization.registerView('pdfMP');