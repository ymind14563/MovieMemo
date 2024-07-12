const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/CMain`);


// 메인 페이지 요청
router.get('/', (req,res)=>{
  res.render('index');
});

// // 로그아웃 요청
// router.get('/logout', controller.logout);

module.exports = router;