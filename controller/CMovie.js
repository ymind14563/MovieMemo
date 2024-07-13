const db = require("../model/index");
const { requestAPI, manufactureAPI } = require("../utils/apiHandler");

/**
 *  정보를 DB에 추가하는 공통 기능을 함수로 분리,
 *  data 에 담겨야할 정보들 : ( 포스터,  제목,  vod,  줄거리,  출연진 )
 *
 */
const insertToDb = async (data, genres, t) => {
  try {
    const movie = await db.Movie.create(
      {
        posterUrl: data.posterUrl,
        movieTitle: data.movieTitle,
        vodUrl: data.vodUrl,
        movieInfo: data.movieInfo,
        movieCast: data.movieCast,
        movieSynopsys: data.movieSynopsys,
        moviereleaseDate: data.moviereleaseDate,
        movieSalesAcc: data.movieSalesAcc,
      },
      { transaction: t }
    );

    for (const genreName of genres) {
      let [genre] = await db.Genre.findOrCreate({
        where: { genreType: genreName },
        defaults: { genreType: genreName },
        transaction: t,
      });

      await db.MovieGenre.create(
        {
          movieId: movie.movieId,
          genreId: genre.genreId,
        },
        { transaction: t }
      );
    }

    return movie;
  } catch (error) {
    console.error("DB 저장 중 오류 발생 controller/CMovie/insertToDb:", error);
    throw error;
  }
};

/**
 * 에러처리 함수. 상태코드 500에 대응
 *
 */
const errorHandler = (res, err) => {
  console.error("오류 발생:", err);
  res
    .status(500)
    .json({ message: "이거 만든놈이 몬가 잘못했음 (양태완이 만듬ㅇㅇ..)" });
};

/**
 *  특정 영화 상세 정보 조회 - 수정할 것 api key 정보 .env로 옮기기
 *  요청 url `/:movieTitle` - 추후에 영화 평점을 리뷰 페이지로부터 = 영화 제목이 일치하는 부분들의 평점을 평균내서 보여주게 할 수 있을까요오?
 *   요청을 받았을때
 *   1) DB에 해당 영화 제목과 일치하는 영화 데이터가 존재하는지 확인
 *   2) DB에 영화 정보가 없는 경우 API 에 영화 정보 호출 후 저장 DB에 영화 정보 저장
 *
 *   성공적 호출시 응답       res.status(200).json(movie);
 */
exports.getMovie = async (req, res) => {
  try {
    const { movieTitle } = req.params;
    console.log("1 -----------------------------------------------");
    // DB에서 영화 정보 확인
    let movie = await db.Movie.findOne({
      where: { movieTitle: movieTitle },
      include: [{ model: db.Genre, through: db.MovieGenre }],
    });

    console.log("2 -----------------------------------------------");
    // DB에 영화 정보가 없는 경우
    if (!movie) {
      const movieData = await requestAPI(movieTitle);
      console.log("API 에서 정보를 불러오겠습니다.");
      if (!movieData) {
        return res
          .status(404)
          .json({ message: "영화 정보를 찾을 수 없습니다." });
      }
      console.log("3 -----------------------------------------------");

      const dataToInsert = manufactureAPI(movieData);

      if (!dataToInsert.movieTitle) {
        return res.status(400).json({ message: "영화 제목 정보가 없습니다." });
      }

      const genres = movieData.genre.split(",").map((g) => g.trim());
      console.log("4-----------------------------------------------");

      // 트랜잭션 시작
      const t = await db.sequelize.transaction();

      try {
        // Movie 테이블에 데이터 삽입 및 Genre, MovieGenre 테이블 처리
        movie = await insertToDb(dataToInsert, genres, t);

        // 트랜잭션 커밋
        await t.commit();

        // 생성된 영화 정보를 다시 조회 (장르 정보 포함)
        movie = await db.Movie.findOne({
          where: { movieId: movie.movieId },
          include: [{ model: db.Genre, through: db.MovieGenre }],
        });
      } catch (error) {
        // 오류 발생 시 롤백
        await t.rollback();
        throw error;
      }
    }

    // 영화 정보 응답
    res.status(200).json(movie);
  } catch (err) {
    errorHandler(res, err);
  }
};
// 영화에 리스트 요청하기추후 박스오피스 기능에 사용할듯
// exports.getMovieList= async(req,res)=>{
//   try{
//   }catch(err){
//     console.log(err);
//     res.status(500).send('이거 만든놈이 몬가 잘못했음(양태완이 만듬ㅇㅇ..)');
//   }
// };

/**
 *  특정 장르로 영화 리스트 불러오기
 *  요청 url : `/genreList/:genreId`
 *  성공적 처리 후 응답 res.status(200).json({ message: '영화 리스트를 성공적으로 불러왔습니다.', movies: movies });
 */
exports.getMovieType = async (req, res) => {
  try {
    const { genreId } = req.params;

    const movies = await db.Movie.findAll({
      where: {
        genre: genreId,
      },
      attributes: ["id", "movieTitle", "posterUrl", "reviewMovieRating"],
      limit: 20,
    });

    if (movies.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 장르의 영화를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "영화 리스트를 성공적으로 불러왔습니다.",
      movies: movies,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};
/**
 * 영화 정보 추가 생성( 관리자 권한일때 실행, session 체크 필요 ),
 */
exports.postMovie = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      posterUrl,
      movieTitle,
      vodUrl,
      movieSynopsys,
      moviereleaseDate,
      movieSalesAcc,
      movieCast,
      genres,
    } = req.body;

    if (!movieTitle) {
      throw new Error("필수 정보가 누락되었습니다. ");
    }

    const newMovie = await insertToDb(
      {
        posterUrl,
        movieTitle,
        vodUrl,
        movieSynopsys,
        moviereleaseDate,
        movieSalesAcc,
        movieCast,
      },
      genres,
      t
    );

    // 트랜잭션 커밋
    await t.commit();

    const movieWithGenres = await db.Movie.findOne({
      where: { movieId: newMovie.movieId },
      include: [{ model: db.Genre, through: db.MovieGenre }],
    });

    res.status(201).json({
      message: "영화 정보가 성공적으로 추가되었습니다.",
      movie: movieWithGenres,
    });
  } catch (err) {
    // 에러 발생 시 롤백
    await t.rollback();
    errorHandler(res, err);
  }
};

/**
 * 영화 정보 수정하기( 관리자 권한일떄 실행, session 체크 필요 )
 * 영화 제목을 입력받아 DB에서 검색 후 객체로 반환받고, 요청 에 담긴 정보를 업데이트
 *  성공적 처리 후 응답 res.status(200).json({ message: '영화 정보 수정 완료', movie: movie });
 *
 */
exports.patchMovie = async (req, res) => {
  try {
    const {
      posterUrl,
      movieTitle,
      vodUrl,
      movieSynopsys,
      moviereleaseDate,
      movieSalesAcc,
      movieCast,
      genres,
    } = req.body;

    const movie = await db.Movie.findOne({ where: { movieTitle } });

    if (!movie) {
      return res.status(404).json({ message: "영화를 찾을 수 없습니다." });
    }

    await movie.update({
      posterUrl,
      vodUrl,
      movieSynopsys,
      moviereleaseDate,
      movieSalesAcc,
      movieCast,
      genres,
    });

    res.status(200).json({
      message: "영화 정보 수정 완료",
      movie: movie,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

/**
 * 영화 정보 삭제하기( 관리자 권한일떄 실행, session 체크 필요 )
 * 성공적 처리 후 응답 res.status(200).json({ message: '영화 정보 삭제 완료' });
 *
 */
exports.deleteMovie = async (req, res) => {
  try {
    const { movieTitle } = req.body;

    const movie = await db.Movie.findOne({ where: { movieTitle } });

    if (!movie) {
      return res.status(404).json({ message: "영화 정보를 찾을 수 없습니다." });
    }

    await movie.destroy();

    res.status(200).json({ message: "영화 정보 삭제 완료" });
  } catch (err) {
    errorHandler(res, err);
  }
};
