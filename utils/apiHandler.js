const axios = require('axios');
require('dotenv').config(); // dotenv모듈을 호출하고 루트경로에 있는 .env 를 참조함

/**
 * API로부터 영화 데이터를 가져오는 함수
 */
exports.requestAPIByTitle = async (movieTitle) => {
  const apiKey = process.env.KMDBAPIKEY;
  const encodedTitle = encodeURIComponent(movieTitle);
  
  try {
    const apiResponse = await axios.get(
      `https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&listCount=300&detail=Y&query=title="${encodedTitle}"&title="${encodedTitle}"&sort=RANK,1&ServiceKey=${apiKey}`
    );

    // 응답 데이터가 문자열로 오기 때문에, JSON.parse 하기 전에 문자열을 수정
    let responseDataStr = apiResponse.data;
    responseDataStr = responseDataStr.replace(/title="(.+?)"/g, 'title=$1');

    // 문자열을 객체로 변환
    let responseData = JSON.parse(responseDataStr);
    // 가공된 응답 데이터 확인용 log
    // console.log(JSON.stringify(responseData).slice(0, 100) + '...');

    return responseData.Data[0];

  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    return null;
  }
};

exports.requestAPIByActor = async (Actor) => {
  const apiKey = process.env.KMDBAPIKEY;
  const encodedActor = encodeURIComponent(Actor);
  
  try {
    const apiResponse = await axios.get(
      `https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&listCount=300&detail=Y&query=actor="${encodedActor}"&actor="${encodedActor}"&sort=RANK,1&ServiceKey=${apiKey}`
    );

    // 응답 데이터가 문자열로 오기 때문에, JSON.parse 하기 전에 문자열을 수정
    let responseDataStr = apiResponse.data;
    responseDataStr = responseDataStr.replace(/actor="(.+?)"/g, 'actor=$1');

    // 문자열을 객체로 변환
    let responseData = JSON.parse(responseDataStr);
    // 가공된 응답 데이터 확인용 log
    // console.log(JSON.stringify(responseData).slice(0, 100) + '...');

    return responseData.Data[0];

  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    return null;
  }
};

/**
 * 영화 데이터를 가공하는 함수
 */
exports.manufactureAPI = ( method ,movieDataList) => {

  // const processedMovies = movieDataList.Result.map(movieData => {
  //   return {
  //     posterUrl : movieData.posters ? movieData.posters.split('|')[0] : '',
  //     vodUrl : movieData.vods?.vod[0]?.vodUrl || '',
  //     movieSynopsys : movieData.plots?.plot[0]?.plotText || '',
  //     moviereleaseDate : movieData.repRlsDate || '',
  //     movie_salesAcc : movieData.salesAcc || '',
  //     reviewMovieRating : 0,
  //     genre : movieData.genre || '',
  //     movieTitle : method==='title'? movieData.title ? movieData.title.replace(/!HS|!HE/g, '').trim() : '': movieData.title ? movieData.title.trim() : '',
  //     movieCast :method ==='actor'?movieData.actors?.actor?.slice(0, 10).map(actor => actor.actorNm).join(', ').replace(/!HS|!HE/g, '').trim() || '':movieData.actors?.actor?.slice(0, 10).map(actor => actor.actorNm).join(', ').trim() || '',
  //   };
  // });
  // return processedMovies;


  if (method==='title') {  
    const processedMovies = movieDataList.Result.map(movieData => {
      const posterUrl = movieData.posters ? movieData.posters.split('|')[0] : '';
      const movieTitle = movieData.title ? movieData.title.replace(/!HS|!HE/g, '').trim() : '';
      const vodUrl = movieData.vods?.vod[0]?.vodUrl || '';
      const movieSynopsys = movieData.plots?.plot[0]?.plotText || '';
      const movieCast = movieData.actors?.actor?.slice(0, 10).map(actor => actor.actorNm).join(', ') || '';
      const moviereleaseDate = movieData.repRlsDate || '';
      const movie_salesAcc = movieData.salesAcc || '';
      const reviewMovieRating = 0;
      const genre = movieData.genre || '';

      return {
        posterUrl,
        movieTitle,
        vodUrl,
        movieSynopsys,
        movieCast,
        moviereleaseDate,
        movie_salesAcc,
        reviewMovieRating,
        genre
      };
    });
    return processedMovies;
  }else if(method ==='actor'){
    const processedMovies = movieDataList.Result.map(movieData => {
      const posterUrl = movieData.posters ? movieData.posters.split('|')[0] : '';
      const movieTitle = movieData.title ? movieData.title : '';
      const vodUrl = movieData.vods?.vod[0]?.vodUrl || '';
      const movieSynopsys = movieData.plots?.plot[0]?.plotText || '';
      const movieCast = movieData.actors?.actor?.slice(0, 10).map(actor => actor.actorNm).join(', ').replace(/!HS|!HE/g, '').trim() || '';
      const moviereleaseDate = movieData.repRlsDate || '';
      const movie_salesAcc = movieData.salesAcc || '';
      const reviewMovieRating = 0;
      const genre = movieData.genre || '';
  
      return {
        posterUrl,
        movieTitle,
        vodUrl,
        movieSynopsys,
        movieCast,
        moviereleaseDate,
        movie_salesAcc,
        reviewMovieRating,
        genre
      };
    });
    return processedMovies;
  }

};

