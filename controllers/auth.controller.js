const bcrypt = require("bcrypt");
const db = require('../models');
const { generateToken } = require('../utils/token.utils'); 
exports.login = async (req, res) => {
    const { email, password, role } = req.body;  

    try {
        const usuario = await db.usuarios.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
        }

        if (usuario.role !== role) {
            return res.status(401).json({ msg: "Acceso denegado para este rol" });
        }
        const token = generateToken(usuario);

        await db.auth_tokens.create({
            token,
            usuarioId: usuario.id
        });

        res.json({ token, role: usuario.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor durante el login" });
    }
};


exports.logout = async (req, res) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        const [bearer, token] = authorization.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Unauthorized - Invalid token format" });
        }
        const deleted = await db.auth_tokens.destroy({
            where: { token }
        });

        if (deleted === 0) {
            return res.status(400).json({ message: "Invalid token" });
        }

        res.json({
            msg: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.me = async (req, res) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const [bearer, token] = authorization.split(" ");
        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Unauthorized - Invalid token format" });
        }

   
        const tokenObj = await db.auth_tokens.findOne({
            where: { token }
        });

        if (!tokenObj) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const usuario = await db.usuarios.findByPk(tokenObj.usuarioId);
        if (!usuario) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        res.json({ usuario });
    } catch (error) {
        console.error("Error in 'me' controller:", error);
        return res.status(500).json({ message: "Server error" });
    }
};