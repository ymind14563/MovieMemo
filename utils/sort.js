const sort = (sortBy) => {
    let order = [];

    // 정렬 기준
    if (sortBy === 'latest') { 
        order = [['createdAt', 'DESC']]; // 최신순
    } else if (sortBy === 'oldest') { 
        order = [['createdAt', 'ASC']]; // 등록일순
    } else if (sortBy === 'rating') { 
        order = [['reviewMovieRating', 'DESC'], ['createdAt', 'DESC']]; // 평점순, 평점이 같다면 최신순
    }

    return order;
}

module.exports = { sort };