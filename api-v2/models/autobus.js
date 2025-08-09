import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ESTADO = ['activo', 'mantenimiento', 'fuera_servicio'];

const Autobus = sequelize.define(
  'Autobus',
  {
    id: {                                // ✅ PK consistente
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    placa: { type: DataTypes.STRING(255), allowNull: true, unique: true },
    modelo: { type: DataTypes.TEXT, allowNull: true },
    anio: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, validate: { min: 0 } },
    capacidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, validate: { min: 0 } },
    estado: { type: DataTypes.ENUM(...ESTADO), allowNull: true, defaultValue: 'activo' },
    conductorId: {
      type: DataTypes.BIGINT.UNSIGNED,   // ✅ FK BIGINT
      allowNull: true,
      references: { model: 'Trabajadores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    tableName: 'Autobuses',
    timestamps: true,
    underscored: true,
  }
);

Autobus.associate = (models) => {
  Autobus.belongsTo(models.Trabajador, { as: 'conductor', foreignKey: 'conductorId' });
};

// Validar puesto del conductor
Autobus.addHook('beforeSave', async (bus) => {
  if (!bus.conductorId) return;
  const { Trabajador } = sequelize.models;
  const t = await Trabajador.findByPk(bus.conductorId, { attributes: ['puesto'] });
  if (!t || t.puesto !== 'conductor') {
    throw new Error('El trabajador seleccionado no tiene puesto "conductor".');
  }
});

export default Autobus;
