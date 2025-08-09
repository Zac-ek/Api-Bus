import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ruta = sequelize.define(
  'Ruta',
  {
    // en cada modelo:
id: {
  type: DataTypes.BIGINT.UNSIGNED,
  autoIncrement: true,
  primaryKey: true,
},

    nombre: { type: DataTypes.TEXT, allowNull: true },
    punto_inicio: { type: DataTypes.TEXT, allowNull: true },
    punto_final: { type: DataTypes.TEXT, allowNull: true },
    distancia_km: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // Guardamos duración en segundos
    tiempo_estimado_seg: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },

    autobus_asignadoId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'Autobuses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },

    activo: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
  },
  {
    tableName: 'Rutas',
    timestamps: true,
    underscored: true,
  }
);

Ruta.associate = (models) => {
  Ruta.belongsTo(models.Autobus, {
    as: 'autobus_asignado',
    foreignKey: 'autobus_asignadoId',
  });
  Ruta.hasMany(models.Horario, { as: 'horarios', foreignKey: 'rutaId' });
};

export default Ruta;
