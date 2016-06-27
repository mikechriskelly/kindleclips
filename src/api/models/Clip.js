import DataType from 'sequelize';
import Model from '../sequelize';

const Clip = Model.define('Clip', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  userId: {
    type: DataType.UUID,
    unique: 'compositeIndex',
    comment: 'Clip Owner',
    allowNull: false,
  },

  hash: {
    type: DataType.BIGINT,
    unique: 'compositeIndex',
    comment: 'Protects against duplicate clips',
    allowNull: false,
  },

  title: {
    type: DataType.STRING(400),
    allowNull: true,
  },

  author: {
    type: DataType.STRING(80),
    allowNull: true,
  },

  text: {
    type: DataType.TEXT,
    allowNull: false,
  },

}, {
  classMethods: {
    vectorName: 'search',
    async addFullTextIndex() {
      const searchFields = ['title', 'author', 'text'];
      try {
        await Model.query(`ALTER TABLE "${this.tableName}"
                           ADD COLUMN "${this.vectorName}" TSVECTOR`);
        await Model.query(`UPDATE "${this.tableName}"
                           SET "${this.vectorName}" = to_tsvector(\'english\',
                           '${searchFields.join('\' || \'')}')`);
        await Model.query(`CREATE INDEX post_search_idx ON "${this.tableName}"
                           USING gin("${this.vectorName}");`);
        await Model.query(`CREATE TRIGGER post_vector_update
                           BEFORE INSERT OR UPDATE ON "${this.tableName}"
                           FOR EACH ROW EXECUTE PROCEDURE
                           tsvector_update_trigger("${this.vectorName}",
                           'pg_catalog.english', ${searchFields.join(', ')})`);
      } catch (err) {
        console.log(err);
      }
    },
    async search(query) {
      const cleanQuery = Model.getQueryInterface().escape(query);
      console.log(cleanQuery);
      return Model.query(`SELECT * FROM "${this.tableName}"
                          WHERE "${this.vectorname}"
                          @@ plainto_tsquery(\'english\', ${cleanQuery})`, this);
    },
  },
});

export default Clip;
