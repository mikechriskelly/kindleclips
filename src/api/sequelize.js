import Sequelize from 'sequelize';
import { databaseUrl } from '../config';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  define: {
    freezeTableName: true,
  },
  logging: false,
});

export default sequelize;
