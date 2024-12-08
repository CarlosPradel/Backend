const express = require('express');
const router = express.Router();
const municipioController = require("../controllers/municipio.controller.js");
const { verifyToken, isVerificador } = require("../middlewares/auth.middleware.js");


router.post('/', verifyToken, isVerificador, municipioController.createMunicipio);


router.get("/", municipioController.listMunicipios);
router.put("/:id", verifyToken, isVerificador, municipioController.updateMunicipio);
router.delete("/:id", verifyToken, isVerificador, municipioController.deleteMunicipio);

module.exports = app => {
    app.use("/api/municipio", router); 
};
