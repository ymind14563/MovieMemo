const { reviewModel, memberModel, movieModel } = require('../model');
const { where } = require('sequelize');
const { query } = require('express');

// 리뷰 생성
exports.postReview = async (req, res) => {
    const { memberId, movieId, rating, content } = req.body;

    try {
        const review = await reviewModel.create({
            memberId, movieId, content, reviewMovieRating : rating
        });

        /* // 해당 영화의 모든 리뷰 조회
        const movieReviewList = await reviewModel.findAll({ where: { movieId } });
        // 새로운 리뷰 평균 평점 계산 (DB에 있는 평점을 처음부터 전부 계산하므로 DB를 전부 읽어야 함)
        const totalReviews = movieReviewList.length;
        const sumRating = movieReviewList.reduce((sum, r) => sum + r.reviewMovieRating, 0);
        const avgRating = sumRating / totalReviews;
        
        // 영화의 평균 평점 업데이트
        await movieModel.update({ avgRating }, { where: { id: movieId } }); */


        // 현재 영화의 리뷰 평균 평점 업데이트
        // 새로 작성한 리뷰에 해당하는 영화 조회
        const movie = await movieModel.findOne({ where: { movieId } });

        // 현재 컬럼에 등록된 영화 리뷰 평점 평균 (새로 작성된 리뷰 포함 하지 않음)
        const currentAvgRating = movie.avgRating;

        // 영화 리뷰 개수 (새로 작성된 리뷰 포함)
        const totalReviews = await reviewModel.count({ where: { movieId } });

        // 새로운 평균 평점 계산 (새로 작성된 리뷰 포함)
        const newAvgRating = ((currentAvgRating * (totalReviews - 1)) + rating) / totalReviews;
        // const newAvgRating = ((currentAvgRating * (totalReviews - 1)) + review.reviewMovieRating) / totalReviews;

        // 영화 리뷰 평점 평균 업데이트
        await movieModel.update({ avgRating: newAvgRating }, { where: { movieId } });

        return res.status(201).json({ message: `리뷰가 작성되었습니다.`, review });
        // 추후 생성 시 필요한 nick은 session 참조
        // return res.status(201).render(`review`, { data: review, session: session });
        
    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰를 생성할 수 없습니다.` });
    }
}

// 특정 리뷰 한개 조회
exports.getReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await reviewModel.findOne({
            where: { reviewId },

            include: [{
                model: memberModel,
                attributes: [`nick`]
            }]
        });

        if (!review) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})
        
        return res.status(200).json(review);

    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 조회 중 오류가 발생했습니다.` });
    }
}

// 회원이 작성한 리뷰 목록
exports.getMemberReviewList = async (req, res) => {
    const { memberId } = req.body;
    const { sortBy = 'rating', page = 1, pageSize = 8 } = req.query;

    let order = [];

    // 정렬 기준
    if (sortBy === 'latest') { order = [['createdAt', 'DESC']]; // 최신순
    } else if (sortBy === 'oldest') { order = [['createdAt', 'ASC']]; // 등록일순
    } else if (sortBy === 'rating') { order = [['reviewMovieRating', 'DESC'], ['createdAt', 'DESC']]; } // 평점순, 평점이 같다면 최신순
        
    const limit = parseInt(pageSize, 10); // 한 페이지에 몇 개의 결과를 보여줄지 설정
    const offset = (page - 1) * limit; // 몇 개의 결과를 건너뛸지 계산

    try {
        const { count, rows } = await reviewModel.findAndCountAll({
            where: { memberId },

            // SET: memberModel에서 nick, movieModel에서 title
            include: [{
                model: memberModel,
                attributes: [`nick`]
            },
            {
                model: movieModel,
                attributes: [`title`]
            }],

            order, // order : order
            offset,
            limit
        });

        const totalPages = Math.ceil(count / limit); // 전체 페이지 수 계산

        if (!rows.length) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})

        return res.status(200).json({
            reviews : rows,
            currentPage : page,
            totalPages,
            totalReviews : count
        });

    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 조회 중 오류가 발생했습니다.` });
    }
}

// 영화에 작성된 리뷰 목록
exports.getMovieReviewList = async (req, res) => {
    const { movieId } = req.params;
    const { sortBy = 'rating', page = 1, pageSize = 8 } = req.query;

    let order = [];

    // 정렬 기준
    if (sortBy === 'latest') { order = [['createdAt', 'DESC']];
    } else if (sortBy === 'oldest') { order = [['createdAt', 'ASC']];
    } else if (sortBy === 'rating') { order = [['reviewMovieRating', 'DESC'], ['createdAt', 'DESC']]; }

    const limit = parseInt(pageSize, 10);
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await reviewModel.findAndCountAll({
            where: { movieId },

            include: [{
                model: memberModel,
                attributes: [`nick`]
            }],

            order,
            offset,
            limit
        });

        const totalPages = Math.ceil(count / limit);

        if (!rows.length) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})

        return res.status(200).json({
            reviews : rows,
            currentPage : page,
            totalPages,
            totalReviews : count
        });
        
    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 조회 중 오류가 발생했습니다.` });
    }
}


// 특정 리뷰 내용 수정
exports.patchReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, content } = req.body;

    try {
        const review = await reviewModel.findOne({
            where: { reviewId }
        });

        if (!review) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})
        
        // 수정 전 영화 리뷰 평점
        const previousMovieRating = review.reviewMovieRating;

        // 수정 후 영화 리뷰 평점
        review.reviewMovieRating = rating;
        review.content = content;
        await review.save();

        // 영화의 리뷰 평균 평점 업데이트
        const movie = await movieModel.findOne({ where: { movieId: review.movieId } });
        const currentAvgRating = movie.avgRating;
        const totalReviews = await reviewModel.count({ where: { movieId: review.movieId } });
        const newAvgRating = ((currentAvgRating * totalReviews) - previousMovieRating + rating) / totalReviews;

        await movieModel.update({ avgRating: newAvgRating }, { where: { movieId: review.movieId } });

        return res.status(200).json(review);

    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 수정 중 오류가 발생했습니다.` });
    }
}

// 특정 리뷰 삭제
exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    
    try {
        const review = await reviewModel.findOne({
            where: { reviewId }
        })

        if (!review) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})

        // 삭제 할 영화 리뷰 평점
        const deleteMovieRating = review.reviewMovieRating;

        await review.destroy();

        // 영화의 리뷰 평균 평점 업데이트
        const movie = await movieModel.findOne({ where: { movieId: review.movieId } });
        const currentAvgRating = movie.avgRating;
        const totalReviews = await reviewModel.count({ where: { movieId: review.movieId } });

        // 리뷰 삭제 후 남은 리뷰가 있다면 다시 계산, 없으면 0으로 처리
        const newAvgRating = totalReviews > 0 ? ((currentAvgRating * (totalReviews + 1)) - deleteMovieRating) / totalReviews : 0;

        await movieModel.update({ avgRating: newAvgRating }, { where: { movieId: review.movieId } });

        return res.status(200).json({ message: `리뷰가 삭제되었습니다.`})

    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 삭제 중 오류가 발생했습니다.` });
    }
}