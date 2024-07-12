const RReview = require('../routes/RReview');
const RMovie = require('../routes/RMovie');
const RMember = require('../routes/RMember');
const RMain = require('../routes/RMain');

exports.routerMiddleware=(app)=>{
  app.use("/", RMain);
  app.use("/member", RMember);
  app.use("/review", RReview);
  app.use("/movie", RMovie);
}
