const { Review, Member, Movie, Like, Report } = require('../model');
const { paginate, paginateResponse } = require('../utils/paginate');
const { sort } = require('../utils/sort');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// 관리자 조회
exports.getAdminPage = async (req, res) => {
    const { memberPage = 1, memberPageSize = 8, reviewPage = 1, reviewPageSize = 8, nick } = req.query;
    
    // 페이지네이션 설정
    const { limit : memberLimit, offset: memberOffset } = paginate(memberPage, memberPageSize);
    const { limit : reviewLimit, offset: reviewOffset } = paginate(reviewPage, reviewPageSize);

    try {
        // 닉네임 기준 멤버 검색 조건 설정 (쿼리가 비어있다면 가나다 순)
        let memberWhereCondition = {};
        if (nick) {
            memberWhereCondition = {
                nick: {
                    [Op.like]: `%${nick}%`
                }
            };
        }

        // 멤버 목록 조회 및 닉네임 기준으로 정렬
        const { count: memberCount, rows: memberRows } = await Member.findAndCountAll({
            where: memberWhereCondition,
            order: [['nick', 'ASC']],
            limit : memberLimit,
            offset: memberOffset
        });

        // 정확히 일치하는 회원을 최상단에 배치
        const exactMemberMatches = memberRows.filter(member => member.nick === nick);
        const partialMemberMatches = memberRows.filter(member => member.nick !== nick);
        const sortedMembers = [...exactMemberMatches, ...partialMemberMatches];

        // 리뷰 목록 조회
        const { count: reviewCount, rows: reviewRows } = await Review.findAndCountAll({
            order: sort('report'),
            include: [
                {
                    model: Member,
                    attributes: ['nick']
                },
                {
                    model: Movie,
                    attributes: ['movieTitle']
                }
            ],
            limit : reviewLimit,
            offset: reviewOffset
        });

        if (sortedMembers.length === 0) {
            return res.status(404).json({ message: `회원 목록을 찾을 수 없습니다.` });
        }
        if (reviewRows.length === 0) {
            return res.status(404).json({ message: `리뷰를 찾을 수 없습니다.` });
        }

        console.log(sortedMembers, memberCount, memberPage, memberLimit)
        return res.status(200).json({
            members: paginateResponse(sortedMembers, memberCount, memberPage, memberLimit, 'members'),
            reviews: paginateResponse(reviewRows, reviewCount, reviewPage, reviewLimit, 'reviews')
        });

    } catch (error) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({ message: `조회 중 오류가 발생했습니다.` });
    }
};
