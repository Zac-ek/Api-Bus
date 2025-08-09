// models/boleto.js (ESM)
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ESTADO = ['reservado', 'cancelado', 'completado'];

const Boleto = sequelize.define(
  'Boleto',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'Usuarios', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      field: 'usuario_id',                 // ✅ mapea a snake_case explícito
    },
    rutaId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'Rutas', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      field: 'ruta_id',
    },
    autobusId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'Autobuses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      field: 'autobus_id',
    },
    horarioId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'Horarios', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      field: 'horario_id',
    },
    fecha_reservacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    fecha_viaje: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    asiento_numero: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'reservado',
      validate: { isIn: [ESTADO] },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: 'Boletos',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        // ✅ usa los NOMBRES DE COLUMNA reales (snake_case)
        fields: ['autobus_id', 'fecha_viaje', 'asiento_numero', 'horario_id'],
      },
    ],
  }
);

// Asociaciones
Boleto.associate = (models) => {
  Boleto.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
  Boleto.belongsTo(models.Ruta, { foreignKey: 'rutaId', as: 'ruta' });
  Boleto.belongsTo(models.Autobus, { foreignKey: 'autobusId', as: 'autobus' });
  Boleto.belongsTo(models.Horario, { foreignKey: 'horarioId', as: 'horario' });
};

export default Boleto;
