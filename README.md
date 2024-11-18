
<div align="center">
  <h1> <img src="https://github.com/user-attachments/assets/9c0be396-83d4-4642-a9b9-7dd91c79ef62" alt="MovieMemo" width="30"/> MovieMemo</h1>
  <br>
</div>

<br>

![대표이미지](https://github.com/user-attachments/assets/e8aeb71e-c7a8-4b6b-8327-fbe07a825c42)

<br>

## <img src="https://github.com/user-attachments/assets/9c0be396-83d4-4642-a9b9-7dd91c79ef62" alt="Smile Hub" width="30"/> 프로젝트 소개


* 주제 : 영화리뷰를 작성하는 사이트
* 기획 의도 : 다양한 장르의 영화 리뷰를 작성하고 공유하여 본인이 감상한 이외의 영화들도 시도할 수 있게 도와줌
* 기간 : 2024.07.10 ~ 2024.07.23 ( 14일 )
* Repository: [https://github.com/ymind14563/MovieMemo](https://github.com/ymind14563/MovieMemo) 

<br>

#### [작동 영상으로 바로가기](#clipboard-주요-페이지)

<br>

## :raising_hand: Developers

| 이름     | 역할              | GitHub 링크                                                                 |
|----------|-------------------|----------------------------------------------------------------------------|
| 석원준   | 팀장 - 백엔드      | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/ymind14563) |
| 문주인   | 팀원 - 백엔드      | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/munjuin) |
| 양태완   | 팀원 - 백엔드      | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/behindy3359) |
| 이주연   | 팀원 - 프론트엔드  | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/pouryourlove) |
| 이동욱   | 팀원 - 프론트엔드  | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/anemoa) |


<br>
<br>

## ⭐️ 내가 맡은 역할
#### 백엔드
  - 리뷰 CRUD - 리뷰등록, 리뷰수정, 리뷰확인, 리뷰삭제
    - 추천 Top3 리뷰
    - 부적절한 단어 필터링 (badWordsFilter)
    - 리뷰 작성, 수정, 삭제 시 영화 평균 평점 재계산
  - 마이페이지, 관리자페이지 Controller
  - 페이지네이션 기능(paginate)
  - 정렬 기능(sort)
    
#### 프론트엔드 (EJS)
  - 마이페이지
    - 회원정보 수정, 회원 탈퇴
    - 본인 작성 리뷰 목록 조회, 리뷰 추천 수 조회
    - 리뷰 수정, 리뷰 삭제
    - 페이지네이션, (등록, 추천) 등 정렬 기능
  - 관리자페이지
    - 관리자 전용 페이지(토큰으로 확인), 관리자 아이디로 접속 시 헤더에 관리자전용 버튼 노출
    - 회원 전체 리뷰 목록 조회, 리뷰 신고 수 조회
    - 리뷰 삭제, 회원 추방 기능
    - 페이지네이션, (등록, 추천) 등 정렬 기능
      
#### 서버배포(NCP)
  - NCP(Naver Cloud Platform)
  - Cloud DB for MySQL
  

<br>


## 🧰 Architecture



## ❓ 주요 채택 이유

- **JWT** (JSON Web Token) : 보안 및 서버의 부하를 줄이고, 확장성을 높이기 위해 채택
- **Sequelize**: Node.js 환경에 최적화 되어있어 비동기 프로그래밍에 적합하고, 복잡한 쿼리문 대신 ORM을 사용하여 데이터 추출을 위해 채택
- **NCP** (Naver Cloud Platform) : 국내 클라우드 시장에서 점유율을 높여가고 있으며, 서버, 데이터베이스 등 다양한 서비스를 지원하고 유연성의 이점으로 인해 채택
- **Swiper** : 원하는 대로 슬라이더를 커스터마이징 할 수 있는 편리성과 높은 브라우저 호환성을 가져서 채택
- **badWordsFilter** : CommonJS로 작동, 다국어 비속어 필터링이 가능해서 채택
- **KMDB API** : 예고편, 포스터 등 주요 필요한 정보들을 가진 유일한 API로 인해 채택


<br>

## 📂 프로젝트 구조

```
.
|-- app.js
|-- config
|-- controller
|-- middleware
|-- model
|-- public
|   |-- css
|   |-- img
|   `-- js
|-- routes
|-- utils
`-- views
    |-- partials
    |   `-- components
```

<br>

## :bulb: 요구사항정의서
![사용자요구사항정의서](https://github.com/user-attachments/assets/7c0068e5-e3bc-48b8-9187-bffaa91ee98f)

<br>

## 📚 데이터베이스 ERD
![ERD](https://github.com/user-attachments/assets/e6bc271b-2d6b-4616-828f-1b3a05a58c37)

<br>

## 📚 테이블명세서
![테이블명세서](https://github.com/user-attachments/assets/0d2561e9-880b-459b-bebe-a23c9a1061e8)

<br>

## 📚 KanbanBoard 
![KanbanBoard](https://github.com/user-attachments/assets/8d44c66e-bc87-41dc-8a6b-7285b4f8b4a0)

<br>


## :clipboard: 주요 페이지

### - 회원가입 페이지
- 이메일, 닉네임 중복 검사
  
![회원가입](https://github.com/user-attachments/assets/e2c08ee1-db28-4f6b-8c33-be9a993b723e)

<br>

### - 메인 페이지
- 메인베너(전체리뷰 TOP 3)
- 영화 포스터 Swiper 적용
- 페이지 새로고침 시 장르 목록 랜덤으로 변경
  
![메인페이지](https://github.com/user-attachments/assets/a98ea112-a119-43fa-b324-d236d01056ae)

<br>

### - 영화검색 페이지
- 영화 제목, 배우 로 검색
- 무한스크롤 구현
  
![영화검색페이지](https://github.com/user-attachments/assets/8e44cc7d-6b69-400d-bcb0-d20056c212aa)

<br>

### - 영화상세 페이지
- 예고편 존재 시 예고편 최상단 노출
- 영화 상세 정보 확인
- 리뷰 작성, 수정, 삭제
- 좋아요, 신고 기능 (토글)
  
![영화상세페이지](https://github.com/user-attachments/assets/4d2b2193-753a-4d3a-af73-f8b737d73c66)

<br>

### - 마이 페이지 (리뷰)
- 회원정보수정, 회원탈퇴
- 본인 작성 리뷰 목록 확인, 리뷰 삭제
- 리뷰 좋아요 수 확인
- 페이지네이션, 정렬
  
![마이페이지](https://github.com/user-attachments/assets/5917c293-af8e-4b26-9d26-14725b220ac2)

<br>

### - 관리자 페이지
- 관리자 아이디로 접속 시 헤더에 관리자 전용 버튼 노출 (토큰으로 확인)
- 전체 리뷰 목록 확인, 리뷰 삭제, 회원 추방
- 리뷰 신고 수 확인
- 페이지네이션, 정렬
   
![관리자페이지](https://github.com/user-attachments/assets/d2cf3a4e-0818-4b5d-b104-ff752eab8c9f)

<br>

### - 마이 페이지 (회원정보)
- 회원정보수정, 회원탈퇴

![정보수정및탈퇴](https://github.com/user-attachments/assets/79a5f69a-9c96-4f7a-a7d5-05e328627f5b)


