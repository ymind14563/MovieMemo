module.exports = (sequelize, DataTypes) => {
  /**
  * Movie 영화 정보가 들어갈 모델 생성하기!
  * @param {Object} sequelize
  * @param {Object} DataTypes
  * @returns {Object} Movie 모델 반환하기 
  * 
  * @property {number} movie_id - 식별 번호
  * @property {string} movie_title - 제목
  * @property {string} poster_url - 포스터가 저장된 url 주소
  * @property {string} movie_info - 상세정보( 줄거리 등 )
  * @property {string} movie_cast - 출연진 정보
  */
  const Movie = sequelize.define('Movie', {
    movieId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    movieTitle: {
      type: DataTypes.varchar(50),
      allowNull: false
    },
    posterUrl: {
      type: DataTypes.varchar(300),
      allowNull: false
    },
    vodUrl: {
      type: DataTypes.varchar(300),
      allowNull: false
    },
    movieInfo: {
      type: DataTypes.varchar(1000),
      allowNull: false
    },
    movieCast: {
      type: DataTypes.varchar(100),
      allowNull: false
    }
  }, {
    // 작성, 최종 수정시간 기록
    tableName: 'Movie',
    timestamps: true
  });
  // 모델간 관계 설정하기 
  Movie.associate = (models) => {
    Movie.hasMany(models.Review, { foreignKey: 'movieId' });
    Movie.belongsToMany(models.Genre, { through: models.MovieGenre, foreignKey: 'movieId' });
  };

  return Movie;
};