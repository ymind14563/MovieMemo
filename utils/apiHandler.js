const axios = require('axios');
require('dotenv').config();

/**
 * API로부터 영화 데이터를 가져오는 함수
 */
exports.requestAPI = async (movieTitle) => {
  const apiKey = process.env.KMDBAPIKEY;
  const encodedTitle = encodeURIComponent(movieTitle);
  const apiResponse = await axios.get(`https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${encodedTitle}&ServiceKey=${apiKey}`);
  
  return apiResponse.data.Data[0]?.Result[0];
};

/**
 * 영화 데이터를 가공하는 함수
 */
exports.manufactureAPI = (movieData) => {
  return {
    posterUrl: movieData.posters.split('|')[0] || '',
    movieTitle: movieData.title.replace(/!HS|!HE/g, '').trim(),
    vodUrl: movieData.vods?.vod[0]?.vodUrl || '', 
    movieInfo: movieData.plots.plot[0]?.plotText || '',
    movieCast: movieData.actors.actor.slice(0, 5).map(actor => actor.actorNm).join(', ') || ''
  };
};
