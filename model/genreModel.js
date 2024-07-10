module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Genre',
    timestamps: false
  });

  Genre.associate = (models) => {
    Genre.belongsToMany(models.Movie, { through: 'MovieGenre', foreignKey: 'genre_id' });
  };

  return Genre;
};