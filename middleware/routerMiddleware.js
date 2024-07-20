const RReview = require('../routes/RReview');
const RMovie = require('../routes/RMovie');
const RMember = require('../routes/RMember');
const RMyPage = require('../routes/RMyPage');

exports.routerMiddleware=(app)=>{
  app.use("/member", RMember);
  app.use("/review", RReview);
  app.use("/movie", RMovie);
  app.use("/mypage", RMyPage);
}
