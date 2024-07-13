const axios = require("axios");
const { logger } = require("sequelize/lib/utils/logger");
require("dotenv").config();

/**
 * API로부터 영화 데이터를 가져오는 함수
 */
exports.requestAPI = async (movieTitle) => {
  const apiKey = process.env.KMDBAPIKEY;
  const encodedTitle = encodeURIComponent(movieTitle);
  const insertQuery = "title" + "=" + movieTitle;
  const queryTitle = encodeURIComponent(insertQuery);
  // const queryTitle2 =   title+ '=' + encodeURIComponent(movieTitle);
  console.log(queryTitle);
  console.log(`title = ${movieTitle}`);
  const apiResponse = await axios.get(
    `https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&query=${queryTitle}&title=${encodedTitle}&ServiceKey=${apiKey}`
  );
  console.log(
    "---------------------------------------------------------------",
    apiResponse.data
  );
  return apiResponse.data.Data[0].Result[0];
};

/**
 * 영화 데이터를 가공하는 함수
 */
exports.manufactureAPI = (movieData) => {
  return {
    movieTitle: movieData.title.replace(/!HS|!HE/g, "").trim(),
    posterUrl: movieData.posters.split("|")[0] || "",
    vodUrl: movieData.vods?.vod[0]?.vodUrl || "",
    movieSynopsys: movieData.plots.plot[0]?.plotText || "",
    moviereleaseDate: movieData.repRlsDate || "",
    movieSalesAcc: movieData.salesAcc || "0",
    movieCast:
      movieData.actors.actor
        .slice(0, 5)
        .map((actor) => actor.actorNm)
        .join(", ") || "",
    genre: movieData.genre.split(",").map((g) => g.trim()),
  };
};
