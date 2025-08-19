import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ESTADO = ["activo", "inactivo"];

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    personaId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      unique: true,
      field: "persona_id", // 👈 asegura correspondencia con la columna
      references: { model: "Personas", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    usuario: { type: DataTypes.STRING(255), allowNull: true },
    correo_electronico: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },
    telefono: { type: DataTypes.TEXT, allowNull: true },
    contrasena_hash: {
      type: DataTypes.STRING(128),
      allowNull: true,
      set(value) {
        this.setDataValue("contrasena_hash", bcrypt.hashSync(value, 10));
      },
    },
    estado: {
      type: DataTypes.STRING(16),
      allowNull: true,
      defaultValue: "activo",
      validate: { isIn: [ESTADO] },
    },
    is_active: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    is_staff: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    ultima_conexion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Usuarios",
    timestamps: true,
    underscored: true,
  }
);

Usuario.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.contrasena_hash);
};

Usuario.prototype.generateAuthToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

Usuario.associate = (models) => {
  Usuario.belongsTo(models.Persona, { as: "persona", foreignKey: "personaId" });
  Usuario.hasOne(models.Trabajador, {
    as: "trabajador",
    foreignKey: "usuarioId",
  });
};

export default Usuario;
