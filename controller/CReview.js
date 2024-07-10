const { where } = require('sequelize');
const { reviewModel, memberModel } = require('../model');

// 리뷰 생성
exports.postReview = async (req, res) => {
    const { memberId, movieId, nick, rating, content } = req.body;

    try {
        const review = await reviewModel.create({
            memberId, movieId, content, movie_rating : rating
        });
        
        return res.status(201).json({ message: `리뷰가 작성되었습니다.` }, review);

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

            // SET: memberModel에서 nick
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

    try {
        const reviews = await reviewModel.findAll({
            where: { memberId, movieId },

            // SET: memberModel에서 nick, movieModel에서 title
            include: [{
                module: memberModel,
                attributes: [`nick`]
            },
            {
                module: movieModel,
                attributes: [`title`]
            }]
        });

        if (!reviews) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})

        return res.status(200).json(reviews);

    } catch {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 조회 중 오류가 발생했습니다.` });
    }
}

// 영화에 작성된 리뷰 목록
exports.getMovieReviewList = async (req, res) => {
    const { movieId } = req.params;

    try {
        const reviews = await reviewModel.findAll({
            where: { movieId }
        });

        if (!reviews) return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.`})

        return res.status(200).json(reviews);
        
    } catch {
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

    } catch {
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

    } catch {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `리뷰 삭제 중 오류가 발생했습니다.` });
    }
}