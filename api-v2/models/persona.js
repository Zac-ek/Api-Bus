import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const GENERO = ['M', 'F', 'O'];
const TIPO = ['usuario', 'acompanante', 'externo'];

const Persona = sequelize.define(
  'Persona',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,     // ✅ PK consistente
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: { type: DataTypes.TEXT, allowNull: true },
    primer_apellido: { type: DataTypes.TEXT, allowNull: true },
    segundo_apellido: { type: DataTypes.TEXT, allowNull: true },
    genero: {
      type: DataTypes.STRING(1),
      allowNull: true,
      validate: { isIn: [GENERO] },
    },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true },
    tipo: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { isIn: [TIPO] },
    },
    documento_identidad: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'Personas',
    timestamps: true,
    underscored: true,
  }
);

export default Persona;
