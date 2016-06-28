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
    type: DataType.STRING(120),
    allowNull: true,
  },

  text: {
    type: DataType.TEXT,
    allowNull: false,
  },

  topicProbs: {
    type: DataType.ARRAY(DataType.REAL),
    allowNull: true,
  },

  simClips: {
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
  },

}, {
  classMethods: {
    getVectorName: () => 'search',
    async addFullTextIndex() {
      const searchFields = ['title', 'author', 'text'];
      const vectorName = this.getVectorName();
      try {
        await Model.query(`ALTER TABLE "${this.tableName}"
                           ADD COLUMN "${vectorName}" TSVECTOR`);
        await Model.query(`UPDATE "${this.tableName}"
                           SET "${vectorName}" = to_tsvector(\'english\',
                           '${searchFields.join('\' || \'')}')`);
        await Model.query(`CREATE INDEX post_search_idx ON "${this.tableName}"
                           USING gin("${vectorName}");`);
        await Model.query(`CREATE TRIGGER post_vector_update
                           BEFORE INSERT OR UPDATE ON "${this.tableName}"
                           FOR EACH ROW EXECUTE PROCEDURE
                           tsvector_update_trigger("${vectorName}",
                           'pg_catalog.english', ${searchFields.join(', ')})`);
      } catch (err) {
        console.log('Full Text Search already added.');
      }
    },
    async addIgnoreDuplicateRule() {
      try {
        await Model.query(`CREATE RULE "Clip_on_duplicate_ignore" AS ON INSERT TO "Clip"
                           WHERE EXISTS(SELECT 1 FROM "Clip"
                           WHERE ("userId", "hash")=(NEW."userId", NEW."hash"))
                           DO INSTEAD NOTHING;`);
      } catch (err) {
        console.log('Ignore Duplicate rule already exists');
      }
    },
    async search(userId, searchPhrase, resultLimit) {
      const query = Model.getQueryInterface().escape(searchPhrase);
      const vectorName = this.getVectorName();
      return Model.query(`SELECT id, title, author, text FROM "${this.tableName}"
                          WHERE "userId" = '${userId}'
                          AND ${vectorName} @@ plainto_tsquery(\'english\', ${query})
                          LIMIT ${resultLimit}`,
                          { type: Model.QueryTypes.SELECT })
                  .then(results => results);
    },
  },
});

export default Clip;
