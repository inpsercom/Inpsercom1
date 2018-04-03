
app.termcon2 = kendo.observable({
    onShow: function () {                     
        $("#NumeroChasisTC").text(datos_Cliente.nombre_alias+": "+datos_Vehiculo.numeroorden);        
        },
    afterShow: function () { },
    inicializa: function () { },
});
app.localization.registerView('termcon2');


  function onACEPTA(e) {
    datos_Vehiculo.terminos = 1;
    localStorage.setItem("Inp_DatosVehiculo", JSON.stringify(datos_Vehiculo));
   
    if (datos_Vehiculo.tipoContratoSherloc  == "GOLDEN") {
            kendo.mobile.application.navigate("components/OrdenInstalacion/view.html");
        } else { kendo.mobile.application.navigate("components/OrdenInstalacionBasico/view.html"); }
}
