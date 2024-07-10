const reviewModel = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        
        // 리뷰 식별 번호
        reviewId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 사용자 식별 번호
        memberId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        // 영화 식별 번호
        movieId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        // 리뷰 내용
        content: {
            type: DataTypes.STRING(2000),
            allowNull: false
        },

        // 리뷰에 작성한 영화 평점
        reviewMovieRating: {
            type: DataTypes.INTEGER,
            defaultValue: 5
        },

        // 리뷰 좋아요 수
        likeCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        // 리뷰 신고 수
        reportCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, 
        {
            tableName: 'Review',
            freezeTableName: true,
            timestamps: true, // 리뷰작성일자(createdAt), 리뷰수정일자(updatedAt)
        }
    );
  
    return Review;
};

module.exports = reviewModel;