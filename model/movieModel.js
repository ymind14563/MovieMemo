// - 영화
//     - postMovie - 영화 추가
//     - getMovie - 영화 하나 조회
//     - getMoiveList - 영화 리스트
//     - patchMovie - 영화 정보 수정
//     - deleteMovie - 영화 정보 삭제
//     - getMovieType - 영화 장르로 조회
module.exports = (sequelize, DataTypes) => {
  /**
   * Movie 영화 정보가 들어갈 모델 생성하기!
   * movie_id : 식별 번호
   * movie_title : 제목
   * poster_url : 포스터가 저장된 url 주소
   * movie_info : 상세정보( 줄거리 등 )
   * movie_cast : 출연진 정보
   */
  const Movie = sequelize.define('Movie', {
    movieId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    movieTitle: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    posterUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    movieInfo: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    movieCast: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    // 작성, 최종 수정시간 기록
    timestamps: true
  });
  // 모델간 관계 설정하기 
  Movie.associate = (models) => {
    Movie.hasMany(models.Review, { foreignKey: 'movieId' });
    Movie.belongsToMany(models.Genre, { through: 'MovieGenre', foreignKey: 'movieId' });
  };

  return Movie;
};