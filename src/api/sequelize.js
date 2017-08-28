import Sequelize from 'sequelize';
import { db } from '../config';

const sequelize = new Sequelize(db.url, {
  dialect: 'postgres',
  define: {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  logging: false,
});

export default sequelize;
