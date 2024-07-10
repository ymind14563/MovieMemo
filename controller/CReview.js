const { reviewModel, memberModel, movieModel } = require('../model');
const { where } = require('sequelize');
const { query } = require('express');

// 리뷰 생성
exports.postReview = async (req, res) => {
    const { memberId, movieId, rating, content } = req.body;

    try {
        const review = await reviewModel.create({
            memberId, movieId, content, movie_rating : rating
        });

        return res.status(201).json({ message: `리뷰가 작성되었습니다.`, review});
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
            where: { id: reviewId },

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
    const { sortBy } = req.query;

    let order = [];

    // 정렬 기준
    if (sortBy === 'latest') { order = [['createdAt', 'DESC']]; // 최신순
    } else if (sortBy === 'oldest') { order = [['createdAt', 'ASC']]; // 등록일순
    } else if (sortBy === 'rating') { order = [['movie_rating', 'DESC'], ['createdAt', 'DESC']]; } // 평점순, 평점이 같다면 최신순
        
    try {
        const reviews = await reviewModel.findAll({
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

            order // order : order
        });

        if (!reviews.length) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})

        return res.status(200).json(reviews);

    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 조회 중 오류가 발생했습니다.` });
    }
}

// 영화에 작성된 리뷰 목록
exports.getMovieReviewList = async (req, res) => {
    const { movieId } = req.params;
    const { sortBy } = req.query;

    let order = [];

    // 정렬 기준
    if (sortBy === 'latest') { order = [['createdAt', 'DESC']];
    } else if (sortBy === 'oldest') { order = [['createdAt', 'ASC']];
    } else if (sortBy === 'rating') { order = [['movie_rating', 'DESC'], ['createdAt', 'DESC']]; }

    try {
        const reviews = await reviewModel.findAll({
            where: { movieId },

            include: [{
                model: memberModel,
                attributes: [`nick`]
            }],

            order
        });

        if (!reviews.length) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})

        return res.status(200).json(reviews);
        
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
            where: { id: reviewId }
        });

        if (!review) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})
        
        review.movie_rating = rating;
        review.content = content;
        await review.save();

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
            where: { id: reviewId }
        })

        if (!review) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})
        
        await review.destroy();

        return res.status(200).json({ message: `리뷰가 삭제되었습니다.`})

    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 삭제 중 오류가 발생했습니다.` });
    }
}