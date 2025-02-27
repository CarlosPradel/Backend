module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        municipio_origen_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'municipios', key: 'id' },
        },
        municipio_destino_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'municipios', key: 'id' },
        },
        estado: {
            type: Sequelize.ENUM,
            values: ['libre', 'bloqueada'],
            defaultValue: 'libre',
        },
        motivo_bloqueo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ruta_puntos: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        modificadoPor: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'usuarios', key: 'id' },
        },
        modificadoEn: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
    });

    return Carretera;
};
