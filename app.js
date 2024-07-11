const express = require("express");
const path = require(`path`);
const dotenv = require(`dotenv`);

// 기본 .env 파일을 로드
dotenv.config({
  path: path.resolve(__dirname, `.env`),
});

const session = require("express-session");
const app = express();
const { sequelize } = require(`./model/index`);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션 미들웨어 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS를 사용할 경우 true로 설정
  })
);

// process.env 객체를 통해 환경 변수에 접근
const port = process.env.PORT || 5000;

// 미들웨어 등록
app.use(`/static`, express.static(__dirname + `/public`));

//기본 요청주소 localhost:8000
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const memberRouter = require("./routes/RMember");
app.use("/member", memberRouter);

const reviewRouter = require("./routes/RReview");
app.use("/review", reviewRouter);

const movieRouter = require("./routes/RMovie");
app.use("/movie", movieRouter);

// 404
app.get("*", (req, res) => {
  res.render("404");
});

sequelize
  // force : true ; 서버 실행할 때마다 테이블 재생성
  // force : false ; 서버 실행 시 테이블이 없으면 생성
  .sync({ force: true })
  .then(() => {
    app.listen(
      port,
      () => console.log(`${port}에 연결됨`),
      console.log(`Database connection succeeded!`)
    );
  })
  .catch((err) => {
    console.error(err);
  });
