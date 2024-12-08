const express = require("express");
const router = express.Router();
const carreteraController = require("../controllers/carretera.controller.js");
const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware.js");


router.get("/",  carreteraController.listCarreteras);  
router.post("/", verifyToken, isVerificador, carreteraController.createCarretera); 
router.put("/:id", verifyToken, isVerificador, carreteraController.updateCarretera); 
router.delete("/:id", verifyToken, isVerificador, carreteraController.deleteCarretera); 


module.exports = app => {
    app.use("/api/carretera", router);
};
