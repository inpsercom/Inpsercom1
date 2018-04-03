app.pdfG = kendo.observable({
    onShow: function () {
        $("#NumeroChasisPdfG").text(datos_Cliente.nombre_alias);
        var alto = screen.height - 160;
        var ancho = screen.width - 10;
        document.getElementById("ifmPdfGar").setAttribute('style', 'display: block');
        document.getElementById("ifmPdfGar").style.width = ancho + "px";
        document.getElementById("ifmPdfGar").style.height = alto + "px";
        var diip = "http://200.31.10.92:8092/appk_aekia/garantia_repuestos.pdf";
        dp = "https://docs.google.com/viewer?url=" + diip + "&embedded=true";
        document.getElementById("ifmPdfGar").src = dp;
        kendo.ui.progress($("#pdfGScreen"), false);
    }
});
app.localization.registerView('pdfG');