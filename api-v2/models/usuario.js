import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ESTADO = ['activo', 'inactivo'];

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,     // ✅ PK consistente
      autoIncrement: true,
      primaryKey: true,
    },
    personaId: {
      type: DataTypes.BIGINT.UNSIGNED,     // ✅ FK mismo tipo que Personas.id
      allowNull: true,
      unique: true,                        // OneToOne con Persona
      references: { model: 'Personas', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    usuario: { type: DataTypes.STRING(255), allowNull: true },
    correo_electronico: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },
    telefono: { type: DataTypes.TEXT, allowNull: true },
    contrasena_hash: { type: DataTypes.TEXT, allowNull: true },
    estado: {
      type: DataTypes.STRING(16),
      allowNull: true,
      defaultValue: 'activo',
      validate: { isIn: [ESTADO] },
    },
    is_active: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    is_staff: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    fecha_registro: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    ultima_conexion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'Usuarios',
    timestamps: true,
    underscored: true,
  }
);

Usuario.associate = (models) => {
  Usuario.belongsTo(models.Persona, { as: 'persona', foreignKey: 'personaId' });
  Usuario.hasOne(models.Trabajador, { as: 'trabajador', foreignKey: 'usuarioId' });
};

export default Usuario;
