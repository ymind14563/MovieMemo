const express = require("express");
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", "./views");

const indexRouter = require("./routes/index"); //index는 생략가능
app.use("/", indexRouter); //기본 요청주소가 localhost:port이다

const userRouter = require("./routes/user");
app.use("/user", userRouter);

//404
//맨 마지막 라우트(주소를 설계한 행위)로 선언 : 그렇지 않으면 나머지 라우팅이 전부 무시 됨
//선언 순서가 중요 함
app.get("*", (req, res) => {
  res.render("404");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});