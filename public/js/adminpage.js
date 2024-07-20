document.addEventListener('DOMContentLoaded', () => {

    const reviewList = document.querySelector('tbody');
    const sortOrder = document.getElementById('sortBy');
    const paginationContainer = document.querySelector('.pagination');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const patchModal = document.getElementById('patch-modal');
    const confirmPatchBtn = document.getElementById('confirm-patch');
    const cancelPatchBtn = document.getElementById('cancel-patch');
    const patchContent = document.getElementById('patch-content');

    let currentReviewId = null;
    let currentReviewElement = null;

    reviewList.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more')) {
            const reviewContent = e.target.previousElementSibling;
            if (e.target.textContent === '더보기') {
                reviewContent.classList.add('full');
                e.target.textContent = '간략히';
            } else {
                reviewContent.classList.remove('full');
                e.target.textContent = '더보기';
            }
        }

        if (e.target.classList.contains('del-btn')) {
            const reviewElement = e.target.closest('tr');
            if (reviewElement) {
                currentReviewId = reviewElement.querySelector('.review-delete-btn').getAttribute('data-review-id');
                deleteModal.style.display = 'block'; // 모달 창 열기
            } else {
                console.error('Review element not found');
            }
        }

        if (e.target.classList.contains('patch-btn')) {
            const reviewElement = e.target.closest('tr');
            if (reviewElement) {
                currentReviewId = reviewElement.querySelector('.review-delete-btn').getAttribute('data-review-id');
                currentReviewElement = reviewElement;
                const reviewContent = reviewElement.querySelector('.review-content').textContent;
                patchContent.value = reviewContent;
                patchModal.style.display = 'block'; // 모달 창 열기
            } else {
                console.error('Review element not found');
            }
        }
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (currentReviewId) {
            deleteReview(currentReviewId);
            deleteModal.style.display = 'none'; // 모달 창 닫기
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none'; // 모달 창 닫기
    });

    confirmPatchBtn.addEventListener('click', () => {
        if (currentReviewId && currentReviewElement) {
            const updatedContent = patchContent.value;
            currentReviewElement.querySelector('.review-content').textContent = updatedContent;
            patchReview(currentReviewId, updatedContent);
            patchModal.style.display = 'none'; // 모달 창 닫기
        }
    });

    cancelPatchBtn.addEventListener('click', () => {
        patchModal.style.display = 'none'; // 모달 창 닫기
    });

    sortOrder.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        getReviews(sortBy);
    });

    paginationContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-number')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            getReviews(sortOrder.value, page);
        }
    });

    function getReviews(sortBy, page = 1) {
        axios.get(`/adminpage`, {
            params: {
                sortBy,
                page
            }
        })
        .then(response => {
            const reviews = response.data.reviews;
            const pagination = response.data.pagination;
            renderReviews(reviews);
            renderPagination(pagination);
        })
        .catch(error => {
            console.error('리뷰를 가져올 수 없습니다.', error);
        });
    }

    function deleteReview(reviewId) {
        axios.delete(`/review/${reviewId}`)
        .then(response => {
            getReviews(sortOrder.value); // 삭제 후 리뷰 목록을 다시 로드
        })
        .catch(error => {
            console.error('리뷰를 삭제할 수 없습니다.', error);
        });
    }

    function patchReview(reviewId, content) {
        axios.patch(`/review/${reviewId}`, { content })
        .then(response => {
            getReviews(sortOrder.value); // 수정 후 리뷰 목록을 다시 로드
        })
        .catch(error => {
            console.error('리뷰를 수정할 수 없습니다.', error); // 에러 메시지 출력
        });
    }

    function renderReviews(reviews) {
        reviewList.innerHTML = '';
        reviews.forEach(review => {
            const reviewElement = document.createElement('tr');
            reviewElement.innerHTML = `
                <td>${review.Member.nick}</td>
                <td>${review.Movie.movieTitle}</td>
                <td class="review-content">${review.content}</td>
                <td class="read-more">더보기</td>
                <td>${review.likeCount}</td>
                <td>${review.reportCount}</td>
                <td>${review.createdAt}</td>
                <td>${review.updatedAt}</td>
                <td><button class="review-delete-btn" type="submit" data-review-id="${review.reviewId}">삭제</button></td>
                <td><button class="member-delete-btn" type="submit" data-member-id="${review.memberId}">회원탈퇴</button></td>
            `;
            reviewList.appendChild(reviewElement);

            const reviewContent = reviewElement.querySelector('.review-content');
            const readMoreBtn = reviewElement.querySelector('.read-more');

            if (reviewContent.scrollHeight > reviewContent.clientHeight) {
                readMoreBtn.style.display = 'block';
            } else {
                readMoreBtn.style.display = 'none';
            }
        });
    }

    function renderPagination(pagination) {
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= pagination.totalPages; i++) {
            const pageElement = document.createElement('span');
            if (i === pagination.currentPage) {
                pageElement.classList.add('page-number', 'active');
                pageElement.textContent = i;
            } else {
                const pageLink = document.createElement('a');
                pageLink.href = `#`;
                pageLink.classList.add('page-number');
                pageLink.textContent = i;
                pageLink.setAttribute('data-page', i);
                pageElement.appendChild(pageLink);
            }
            paginationContainer.appendChild(pageElement);
        }
    }

    // 초기 데이터 로드
    getReviews(sortOrder.value);
});
