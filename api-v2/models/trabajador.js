import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PUESTO = ['conductor', 'supervisor', 'mantenimiento', 'administrativo'];
const TURNO = ['matutino', 'vespertino', 'nocturno', 'mixto'];

const Trabajador = sequelize.define(
  'Trabajador',
  {
    id: {                                // ✅ PK consistente
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.BIGINT.UNSIGNED,   // ✅ FK BIGINT
      allowNull: true,
      unique: true,                       // OneToOne
      references: { model: 'Usuarios', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    puesto: {
      type: DataTypes.STRING(32),
      allowNull: true,
      validate: { isIn: [PUESTO] },
    },
    turno: {
      type: DataTypes.STRING(16),
      allowNull: true,
      validate: { isIn: [TURNO] },
    },
    fecha_ingreso: { type: DataTypes.DATEONLY, allowNull: true },
  },
  {
    tableName: 'Trabajadores',
    timestamps: true,
    underscored: true,
  }
);

Trabajador.associate = (models) => {
  Trabajador.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'usuarioId' });
};

export default Trabajador;
