const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller.js");
const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware.js");


router.get("/", verifyToken, isAdmin, usuarioController.listUsuarios); 
router.get("/:id", verifyToken, isAdmin, usuarioController.getUsuarioById); 
router.post("/",  usuarioController.createUsuario); 
router.put("/:id", verifyToken, isAdmin, usuarioController.updateUsuarioPut); 
router.patch("/:id/password", verifyToken, isAdmin, usuarioController.changePassword); 
router.delete("/:id", verifyToken, isAdmin, usuarioController.deleteUsuario); 

module.exports = app => {
    app.use("/api/usuarios", router);
};
