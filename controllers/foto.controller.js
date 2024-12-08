const db = require("../models");
const path = require("path");
const fs = require("fs");

exports.uploadFoto = async (req, res) => {
    const { incidenteId } = req.params;

    try {
        const incidente = await db.incidentes.findByPk(incidenteId);

        if (!incidente) {
            return res.status(404).json({ msg: "Incidente no encontrado" });
        }

        if (!req.files || !req.files.foto) {
            return res.status(400).json({ msg: "No se envió ninguna foto" });
        }

        const foto = req.files.foto;
        const uploadPath = path.join(__dirname, "../uploads", foto.name);

        foto.mv(uploadPath, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Error al subir la foto" });
            }

            const nuevaFoto = await db.fotos_incidente.create({
                url: `/uploads/${foto.name}`,
                incidente_id: incidenteId,
            });

            res.status(201).json(nuevaFoto);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.deleteFoto = async (req, res) => {
    const { fotoId } = req.params;

    try {
        const foto = await db.fotos_incidente.findByPk(fotoId);

        if (!foto) {
            return res.status(404).json({ msg: "Foto no encontrada" });
        }

        const filePath = path.join(__dirname, "../uploads", path.basename(foto.url));

        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Error al eliminar la foto del servidor" });
            }

            await foto.destroy();
            res.json({ msg: "Foto eliminada correctamente" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
