module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    genreId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    genreType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Genre',
    timestamps: false
  });

  Genre.associate = (models) => {
    Genre.belongsToMany(models.Movie, { through: 'MovieGenre', foreignKey: 'genreId' });
  };
  return Genre;
};