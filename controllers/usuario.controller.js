const db = require("../models");
const bcrypt = require("bcrypt");
const { isRequestValid, sendError500 } = require("../utils/request.utils");



exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await db.usuarios.findAll();
        res.json(usuarios);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        res.json(usuario);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.createUsuario = async (req, res) => {
  
    const requiredFields = ["email", "password"];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    try {
        const email = req.body.email;

       
        const usuarioExistente = await db.usuarios.findOne({
            where: { email: email },
        });

        if (usuarioExistente) {
            return res.status(400).json({ msg: "El email ya está registrado" });
        }

      
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        
        const usuario = {
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "publico",  
        };

       
        const usuarioCreado = await db.usuarios.create(usuario);

        
        const usuarioRespuesta = await db.usuarios.findByPk(usuarioCreado.id);

        res.status(201).json(usuarioRespuesta);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.updateUsuarioPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        const email = req.body.email;
        const usuarioExistente = await db.usuarios.findOne({
            where: { email: email }
        });
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
            return res.status(400).json({ msg: 'El email ya está registrado' });
        }
        usuario.email = req.body.email || usuario.email;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.updateUsuarioPut = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }

        const requiredFields = ['email'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }

        const email = req.body.email;
        const usuarioExistente = await db.usuarios.findOne({
            where: { email: email }
        });
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
            return res.status(400).json({ msg: 'El email ya está registrado' });
        }
        usuario.email = req.body.email;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        await usuario.destroy();
        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ msg: 'La contraseña actual y la nueva contraseña son requeridas' });
    }

    try {
        const usuario = await db.usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'La contraseña actual es incorrecta' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        usuario.password = hashedPassword;
        await usuario.save();

        res.json({ msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al cambiar la contraseña' });
    }
};

async function getUsuarioOr404(id, res) {
    const usuario = await db.usuarios.findByPk(id);
    if (!usuario) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return null;
    }
    return usuario;
}
