import shortid from 'shortid';
import DataType from 'sequelize';
import Model from '../sequelize';

const TABLENAME = 'clip';

const Clip = Model.define('clip', {
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
    field: 'user_id',
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

  slug: {
    type: DataType.STRING(20),
    allowNull: true,
  },
});

Clip.generateSlug = () => shortid.generate();

Clip.getVectorName = () => 'search';

Clip.addFullTextIndex = async () => {
  const searchFields = ['title', 'author', 'text'];
  const vectorName = this.getVectorName();
  try {
    await Model.query(
      `ALTER TABLE ${TABLENAME}
        ADD COLUMN ${vectorName} TSVECTOR`,
    );
    await Model.query(
      `UPDATE ${TABLENAME}
        SET ${vectorName} = to_tsvector('english',
        '${searchFields.join("' || '")}')`,
    );
    await Model.query(
      `CREATE INDEX post_search_idx ON ${TABLENAME}
       USING gin(${vectorName});`,
    );
    await Model.query(
      `CREATE TRIGGER post_vector_update
        BEFORE INSERT OR UPDATE ON ${TABLENAME}
        FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(${vectorName},
        'pg_catalog.english', ${searchFields.join(', ')})`,
    );
  } catch (err) {
    console.info('Full Text Search already added.');
  }
};

Clip.addIgnoreDuplicateRule = async () => {
  try {
    await Model.query(
      `CREATE RULE "clip_on_duplicate_ignore" AS ON INSERT TO ${TABLENAME}
        WHERE EXISTS(SELECT 1 FROM ${TABLENAME}
        WHERE (user_id, hash)=(NEW.user_id, NEW.hash))
        DO INSTEAD NOTHING;`,
    );
  } catch (err) {
    console.info('Ignore Duplicate rule already exists');
  }
};

Clip.search = async (userId, searchPhrase, resultLimit) => {
  const query = Model.getQueryInterface().escape(searchPhrase);
  const vectorName = this.getVectorName();
  return Model.query(
    `SELECT id, title, author, text, slug FROM "${TABLENAME}"
        WHERE user_id = '${userId}'
        AND ${vectorName} @@ plainto_tsquery('english', ${query})
        LIMIT ${resultLimit}`,
    { type: Model.QueryTypes.SELECT },
  ).then(results => results);
};

Clip.getSimilar = async clipId =>
  Model.query(
    `SELECT id, title, author, text, slug FROM "${TABLENAME}"
        WHERE id IN (
          SELECT sim_clip_id
          FROM clip_dist
          WHERE clip_id = '${clipId}'
          ORDER BY distance)`,
    { type: Model.QueryTypes.SELECT },
  ).then(results => results);

Clip.getRandom = async (userId, seed = Math.random()) =>
  Model.query(
    `SELECT id, title, author, text, slug FROM "${TABLENAME}"
        WHERE user_id = '${userId}'
        OFFSET ${seed} *
        (SELECT count(*) FROM "${TABLENAME}" WHERE user_id = '${userId}')
        LIMIT 1`,
    { type: Model.QueryTypes.SELECT },
  ).then(results => results);

export default Clip;
