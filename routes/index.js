module.exports = app => {
    require("./usuario.routes")(app); 
    require("./carretera.routes")(app); 
    require("./municipio.routes")(app); 
    require("./incidente.routes")(app); 
    require("./foto.routes")(app); 
    require("./auth.routes")(app); 
};
