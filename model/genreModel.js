module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    genreId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    genreType: {
      type: DataTypes.varchar(10),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Genre',
    timestamps: false
  });

  Genre.associate = (models) => {
    Genre.belongsToMany(models.Movie, { through: models.movieGenre , foreignKey: 'genreId' });
  };
  return Genre;
};