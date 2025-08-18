import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PUESTO = ['conductor', 'supervisor', 'mantenimiento', 'administrativo'];
const TURNO = ['matutino', 'vespertino', 'nocturno', 'mixto'];

const Trabajador = sequelize.define(
  'Trabajador',
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuarioId: {
      type: DataTypes.BIGINT.UNSIGNED, allowNull: true, unique: true,
      references: { model: 'Usuarios', key: 'id' },
      onUpdate: 'CASCADE', onDelete: 'SET NULL',
    },
    puesto: { type: DataTypes.STRING(32), allowNull: true, validate: { isIn: [PUESTO] } },
    turno: { type: DataTypes.STRING(16), allowNull: true, validate: { isIn: [TURNO] } },
    fecha_ingreso: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { tableName: 'Trabajadores', timestamps: true, underscored: true }
);

// 🔑 Asociaciones
Trabajador.associate = (models) => {
  Trabajador.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'usuarioId' });
};

// ✅ Hook: asegurar que el usuario exista y su Persona sea de tipo 'trabajador'
Trabajador.addHook('beforeSave', async (t) => {
  if (!t.usuarioId) return;
  const { Usuario, Persona } = sequelize.models;
  const u = await Usuario.findByPk(t.usuarioId, { attributes: ['personaId'] });
  if (!u) throw new Error('El usuario asociado no existe.');
  if (!u.personaId) throw new Error('El usuario no tiene persona asociada.');
  const p = await Persona.findByPk(u.personaId, { attributes: ['tipo'] });
  if (!p || p.tipo !== 'trabajador') {
    throw new Error('La Persona asociada al usuario debe tener tipo "trabajador".');
  }
});

export default Trabajador;
