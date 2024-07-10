module.exports = (sequelize, DataTypes) => {
  const MovieGenre = sequelize.define('MovieGenre', {
    movie_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Movie',
        key: 'id'
      }
    },
    genre_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Genre',
        key: 'id'
      }
    }
  }, {
    tableName: 'MovieGenre',
    timestamps: false
  });

  return MovieGenre;
};