// models/horario.js (ESM)
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Horario = sequelize.define(
  'Horario',
  {
    // en cada modelo:
id: {
  type: DataTypes.BIGINT.UNSIGNED,
  autoIncrement: true,
  primaryKey: true,
},

    rutaId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'Rutas', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    hora_salida: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    hora_llegada: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    dias_disponibles: {
      type: DataTypes.JSON, // array de días o null
      allowNull: true,
    },
    capacidad_disponible: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'Horarios',
    timestamps: true,
    underscored: true,
  }
);

Horario.associate = (models) => {
  Horario.belongsTo(models.Ruta, { foreignKey: 'rutaId', as: 'ruta' });
};

export default Horario;
