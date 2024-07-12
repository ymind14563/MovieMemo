module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {

        // 좋아요 식별 번호 (확장성, 무결성 위해 작성)
        likeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // 사용자 식별 번호
        memberId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // 리뷰 식별 번호
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        indexes: [
            {
                unique: true, // 중복 방지
                fields: ['memberId', 'reviewId']
            }
        ]
    });

    return Like;
};