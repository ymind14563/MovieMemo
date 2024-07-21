document.addEventListener('DOMContentLoaded', () => {
    const reviewList = document.getElementById('review-list');
    const sortOrder = document.getElementById('sortBy');
    const paginationContainer = document.querySelector('.pagination');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const patchModal = document.getElementById('patch-modal');
    const confirmPatchBtn = document.getElementById('confirm-patch');
    const cancelPatchBtn = document.getElementById('cancel-patch');
    let currentReviewId = null;
    let currentMemberId = null;

    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
        if (e.target === patchModal) {
            patchModal.style.display = 'none';
        }
    });

    function onDeleteButtonClick(button) {
        currentReviewId = button.getAttribute('data-review-id');
        deleteModal.style.display = 'block';
    }

    function onPatchButtonClick(button) {
        currentMemberId = button.getAttribute('data-member-id');
        patchModal.style.display = 'block';
    }

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
            onDeleteButtonClick(e.target);
        }
        if (e.target.classList.contains('patch-btn')) {
            onPatchButtonClick(e.target);
        }
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (currentReviewId) {
            deleteReview(currentReviewId);
            deleteModal.style.display = 'none';
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    confirmPatchBtn.addEventListener('click', () => {
        if (currentMemberId) {
            patchReview(currentMemberId);
            patchModal.style.display = 'none';
        }
    });

    cancelPatchBtn.addEventListener('click', () => {
        patchModal.style.display = 'none';
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
            console.log('리뷰삭제성공', response);
            getReviews(sortOrder.value); // 리뷰 삭제 후 리뷰 목록 갱신
        })
        .catch(error => {
            console.error('리뷰를 삭제할 수 없습니다.', error);
        });
    }

    function patchReview(memberId) {
        axios.patch(`/member/${memberId}/ban`)
        .then(response => {
            console.log('회원 강퇴 성공', response);
            getReviews(sortOrder.value); // 회원 강퇴 후 리뷰 목록 갱신
        })
        .catch(error => {
            console.error('회원을 강퇴할 수 없습니다.', error);
        });
    }

    function renderReviews(reviews) {
        reviewList.innerHTML = '';
        reviews.forEach(review => {
            const reviewRow = document.createElement('tr');
            reviewRow.innerHTML = `
                <td>${review.Member.nick}</td>
                <td>${review.Movie.movieTitle}</td>
                <td class="review-content">${review.content}</td>
                <td class="read-more">더보기</td>
                <td>${review.likeCount}</td>
                <td>${review.reportCount}</td>
                <td>${formatDate(review.createdAt)}</td>
                <td>${formatDate(review.updatedAt)}</td>
                <td><button class="del-btn" type="submit" data-review-id="${review.reviewId}">삭제</button></td>
                <td><button class="patch-btn" type="submit" data-member-id="${review.memberId}">회원탈퇴</button></td>
            `;
            reviewList.appendChild(reviewRow);
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
                pageLink.href = '#';
                pageLink.classList.add('page-number');
                pageLink.textContent = i;
                pageLink.setAttribute('data-page', i);
                pageElement.appendChild(pageLink);
            }
            paginationContainer.appendChild(pageElement);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    getReviews(sortOrder.value);
});
confirmDeleteBtn.addEventListener('click', () => {
    if (currentReviewId) {
        axios.delete(`/review/${currentReviewId}`)
            .then(response => {
                console.log('Review deleted:', response.data);
                getReviews(sortOrder.value);
                deleteModal.style.display = 'none';
            })
            .catch(error => {
                console.error('Error deleting review:', error);
                deleteModal.style.display = 'none';
            });
    }
});

confirmPatchBtn.addEventListener('click', () => {
    if (currentMemberId) {
        axios.patch(`/member/${currentMemberId}/ban`)
            .then(response => {
                console.log('Member banned:', response.data);
                getReviews(sortOrder.value);
                patchModal.style.display = 'none';
            })
            .catch(error => {
                console.error('Error banning member:', error);
                patchModal.style.display = 'none';
            });
    }
});