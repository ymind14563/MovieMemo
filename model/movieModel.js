module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    movieId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    movieTitle: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    posterUrl: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    vodUrl: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    reviewMovieRating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    movieSynopsys: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    moviereleaseDate: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    directorNm: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    movie_salesAcc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    movieCast: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'Movie',
    timestamps: true
  });

  Movie.associate = (models) => {
    Movie.hasMany(models.Review, { foreignKey: 'movieId' });
    Movie.belongsToMany(models.Genre, { through: models.MovieGenre, foreignKey: 'movieId' });
  };

  return Movie;
};