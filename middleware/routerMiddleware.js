const RReview = require('../routes/RReview');
const RMovie = require('../routes/RMovie');
const RMember = require('../routes/RMember');

exports.routerMiddleware=(app)=>{
  app.use("/member", RMember);
  app.use("/review", RReview);
  app.use("/movie", RMovie);
}
