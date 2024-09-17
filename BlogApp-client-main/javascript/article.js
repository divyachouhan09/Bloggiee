const baseURL = 'http://localhost:8080';
let articleEntity = {};

// Function to get the 'id' parameter from the URL
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    modal.style.display='none';
    return urlParams.get('id');
    
}

// Function to fetch article by ID
async function fetchArticleById(id) {
    try {
        const response = await fetch(`${baseURL}/articles/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch the article');
        }
        const article = await response.json();
        articleEntity = article;
        displayArticle(article);
        fetchComments(article.slug);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('post-title').innerText = 'Failed to load article';
    }
}

// Function to display the fetched article
function displayArticle(article) {
    document.getElementById('post-title').innerText = article.title;
    document.getElementById('post-subtitle').innerText = article.subtitle;
    document.getElementById('post-image').src = article.imageLink || 'default-image.jpg';
    document.getElementById('post-author').innerText = article.author.username;
    document.getElementById('post-date').innerText = new Date(article.createdAt).toLocaleDateString();
    document.getElementById('post-body').innerHTML = article.body;
}

// Function to populate the edit modal with article data
function populateEditModal(article) {
    document.getElementById('edit-title').value = article.title;
    document.getElementById('edit-subtitle').value = article.subtitle;
    CKEDITOR.instances['edit-body'].setData(article.body); // Initialize CKEditor with article body
    document.getElementById('edit-imageLink').value = article.imageLink;
}

// Function to update the article
async function updateArticle(id, updatedData) {
    try {
        const response = await fetch(`${baseURL}/articles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) {
            throw new Error('Failed to update the article');
        }
        const updatedArticle = await response.json();
        displayArticle(updatedArticle);
        showMessage('Your content has been saved successfully.');
        closeModal();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to delete the article
async function deleteArticle(id) {
    try {
        const response = await fetch(`${baseURL}/articles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete the article');
        }
        alert('Article deleted successfully');
        window.location.href = '/dashboard.html'; // Redirect to the homepage after deletion
    } catch (error) {
        console.error('Error:', error);
    }
}

// Modal controls
const modal = document.getElementById('editModal');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const span = document.getElementsByClassName('close')[0];

// When the user clicks the edit button, open the modal
editBtn.onclick = function () {
    populateEditModal(articleEntity); // Populate the modal with article data
    modal.style.display = 'flex'; // Display the modal
}

// When the user clicks the delete button, confirm and delete the article
deleteBtn.onclick = function () {
    const confirmed = confirm('Are you sure you want to delete this article?');
    if (confirmed) {
        const articleId = getArticleIdFromUrl();
        if (articleId) {
            deleteArticle(articleId);
        }
    }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    closeModal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Handle the edit form submission
document.getElementById('editForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const confirmed = confirm('Would you like to save the post?');
    if (confirmed) {
        const updatedData = {
            title: document.getElementById('edit-title').value,
            subtitle: document.getElementById('edit-subtitle').value,
            body: CKEDITOR.instances['edit-body'].getData(), // Get CKEditor data
            imageLink: document.getElementById('edit-imageLink').value
        };
        const articleId = getArticleIdFromUrl();
        if (articleId) {
            updateArticle(articleId, updatedData);
        }
        closeModal();
    }
});

// Fetch article on page load
const articleId = getArticleIdFromUrl();
if (articleId) {
    fetchArticleById(articleId);
} else {
    document.getElementById('post-title').innerText = 'Article ID not found';
}

// Fetch and display comments by article slug
async function fetchComments(articleSlug) {
    try {
        const response = await fetch(`${baseURL}/articles/${articleSlug}/comments`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Function to display fetched comments
function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = ''; // Clear previous comments
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <div class="comment-meta">By ${comment.author.username} on ${new Date(comment.createdAt).toLocaleDateString()}</div>
            <div class="comment-body">${comment.body}</div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// Handle the add comment form submission
document.getElementById('addCommentForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const commentData = {
        title: '',
        body: document.getElementById('comment-body').value
    };

    const articleSlug = articleEntity.slug; // Assuming slug can be used in a similar way
    try {
        console.log('articleSlug:', articleSlug);
        const response = await fetch(`${baseURL}/articles/${articleSlug}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(commentData)
        });
        if (!response.ok) {
            throw new Error('Failed to add comment');
        }
        // Refresh comments after adding a new one
        fetchComments(articleSlug);
        // Clear the form
        document.getElementById('comment-body').value = '';
    } catch (error) {
        console.error('Error adding comment:', error);
    }
});

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

// JavaScript for hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        // Toggle 'active' class on navLinks
        navLinks.classList.toggle('active');
        // Toggle 'responsive' class on navbar
        document.querySelector('.navbar').classList.toggle('responsive');
    });
});
