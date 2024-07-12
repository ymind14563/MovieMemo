const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// 모델 불러오기
const Movie = require("./movieModel")(sequelize, Sequelize);
const Genre = require("./genreModel")(sequelize, Sequelize);
const MovieGenre = require("./movieGenreModel")(sequelize, Sequelize);
const Member = require("./memberModel")(sequelize, Sequelize);
const Review = require("./reviewModel")(sequelize, Sequelize);
const Report = require("./reportModel")(sequelize, Sequelize);

// db 객체에 모델 추가
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Movie = Movie;
db.Genre = Genre;
db.MovieGenre = MovieGenre;
db.Member = Member;
db.Review = Review;
db.Report = Report;

// 모델 동기화
const syncModels = async () => {
  await Movie.sync();
  await Genre.sync();
  await MovieGenre.sync();
  await Member.sync();
  await Review.sync();
  await Report.sync();
};

db.syncModels = syncModels;

module.exports = db;
