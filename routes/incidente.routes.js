const express = require("express");
const router = express.Router();
const incidenteController = require("../controllers/incidente.controller.js");
const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware.js");


router.get("/", incidenteController.listIncidentes); 
router.post("/", verifyToken, isVerificador, incidenteController.createIncidente); 
router.put("/:id", verifyToken, isVerificador, incidenteController.updateIncidente); 
router.delete("/:id", verifyToken, isVerificador, incidenteController.deleteIncidente); 


module.exports = app => {
    app.use("/api/incidente", router);
};
