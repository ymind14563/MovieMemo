// - 영화
//     - postMovie - 영화 추가
//     - getMovie - 영화 하나 조회
//     - getMoiveList - 영화 리스트
//     - patchMovie - 영화 정보 수정
//     - deleteMovie - 영화 정보 삭제
//     - getMovieType - 영화 장르로 조회
const db = require('../model/index');
const axios = require('axios');

/** 
 *  정보를 DB에 추가하는 공통 기능을 함수로 분리,
 *  data 에 담겨야할 정보들 : ( 포스터,  제목,  평점,  줄거리,  출연진 )
*/
async function insertToDb(data) {
  try {
    const result = await db.Movie.create({
      posterUrl: data.posterUrl,
      movieTitle: data.movieTitle,
      movieInfo: data.movieInfo,
      movieCast: data.movieCast,
    });
    return result;
  } catch (error) {
    console.error('DB 저장 중 오류 발생 controller/CMovie/insertToDb:', error);
    throw error;
  }
}

/**
 * 특정 영화 상세 정보 조회 - 수정할 것 api key 정보 .env로 옮기기 
 * 요청 url `/:movieTitle` - 추후에 영화 평점을 리뷰 페이지로부터 = 영화 제목이 일치하는 부분들의 평점을 평균내서 보여주게 할 수 있을까요오?
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getMovie = async (req, res) => {
  try {
    const { movieTitle } = req.query;

    // DB에서 영화 정보 확인
    let movie = await db.Movie.findOne({
      where: { movieTitle: movieTitle }
    });

    // DB에 영화 정보가 없는 경우
    if (!movie) {
      // API 호출
      const apiKey = 'YOUR_API_KEY';
      const encodedTitle = encodeURIComponent(movieTitle);
      const apiResponse = await axios.get(`https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${encodedTitle}&ServiceKey=${apiKey}`);
      
      if (!apiResponse.data.Data[0]?.Result[0]) {
        return res.status(404).json({ message: '영화 정보를 찾을 수 없습니다.' });
      }

      const movieData = apiResponse.data.Data[0].Result[0];

      // API 응답을 가공하여 DB 저장 형식에 맞춤
      const dataToInsert = {
        posterUrl: movieData.posters.split('|')[0] || '', // 첫 번째 포스터 URL
        movieTitle: movieData.title.replace(/!HS|!HE/g, '').trim(), // !HS와 !HE 태그 제거
        reviewMovieRating: '0',
        movieInfo: movieData.plots.plot[0]?.plotText || '',
        movieCast: movieData.actors.actor.slice(0, 5).map(actor => actor.actorNm).join(', ') // 상위 5명의 배우
      };

      // 데이터 유효성 검사
      if (!dataToInsert.movieTitle) {
        return res.status(400).json({ message: '영화 제목 정보가 없습니다.' });
      }
      // DB에 저장
      movie = await insertToDb(dataToInsert);
    }

    // 영화 정보 응답
    res.status(200).json(movie);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '이거 만든놈이 몬가 잘못했음(양태완이 만듬ㅇㅇ..)' });
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
*/
exports.getMovieType = async (req, res) => {
  try {
    const { genreId } = req.params;

    // 데이터베이스에서 해당 장르의 영화 리스트를 조회
    const movies = await db.Movie.findAll({
      where: {
        genre: genreId
      },
      attributes: ['id', 'movieTitle', 'posterUrl', 'reviewMovieRating'], // 필요한 필드만 선택
      limit: 20 // 한 번에 불러올 영화 수 제한 (페이지네이션을 위해)
    });

    if (movies.length === 0) {
      return res.status(404).json({ message: '해당 장르의 영화를 찾을 수 없습니다.' });
    }

    res.status(200).json({
      message: '영화 리스트를 성공적으로 불러왔습니다.',
      movies: movies
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '이거 만든놈이 몬가 잘못했음(양태완이 만듬ㅇㅇ..)' });
  }
};
/**
 * 영화 정보 추가 생성( 관리자 권한일때 실행, session 체크 필요 ), 
 * @param {} req 
 * @param {*} res 
 */
exports.postMovie = async (req, res) => {
  try {
    const data = {
      posterUrl: req.body.posterUrl,
      movieTitle: req.body.movieTitle,
      movieInfo: req.body.movieInfo,
      movieCast: req.body.movieCast
    };
    // DB에 저장
    const newMovie = await insertToDb(data);

    // 성공 응답
    res.status(201).json({
      message: '영화 정보가 성공적으로 추가되었습니다.',
      movie: newMovie
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '이거 만든놈이 몬가 잘못했음(양태완이 만듬ㅇㅇ..)' });
  }
};

/**
 * 영화 정보 수정하기( 관리자 권한일떄 실행, session 체크 필요 )
 * @param {*} req 
 * @param {*} res 
 */
exports.patchMovie = async (req, res) => {
  try {
    const movieTitle = req.params.movieTitle; // URL에서 영화 제목을 가져옵니다.
    const { posterUrl, movieInfo, movieCast } = req.body;

    // 영화 제목으로 영화를 찾습니다.
    const movie = await db.Movie.findOne({ where: { movieTitle: movieTitle } });
    
    if (!movie) {
      return res.status(404).json({ message: '영화를 찾을 수 없습니다.' });
    }

    // 영화 정보를 업데이트합니다.
    await movie.update({ 
      posterUrl, 
      movieInfo, 
      movieCast 
    });

    res.status(200).json({ 
      message: '영화 정보 수정 완료',
      movie: movie
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '이거 만든놈이 몬가 잘못했음(양태완이 만듬ㅇㅇ..)' });
  }
};

/**
 * 영화 정보 삭제하기( 관리자 권한일떄 실행, session 체크 필요 )
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteMovie = async (req, res) => {
  try {
    const { movieTitle } = req.params; // URL 파라미터에서 movieTitle을 가져옵니다.
    
    console.log('deleteMovie: movieTitle', movieTitle);
    
    const movie = await db.Movie.findOne({ where: { movieTitle } });
    
    if (!movie) {
      return res.status(404).json({ message: '영화 정보를 찾을 수 없습니다.' });
    }
    
    await movie.destroy();
    
    res.status(200).json({ message: '영화 정보 삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '이거 만든놈이 몬가 잘못했음(양태완이 만듬ㅇㅇ..)' });
  }
};