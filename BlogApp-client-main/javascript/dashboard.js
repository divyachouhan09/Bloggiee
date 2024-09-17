document.addEventListener('DOMContentLoaded', function () {
    const postsGrid = document.getElementById('postsGrid');
    const token = sessionStorage.getItem('token');
    const createPostButton = document.getElementById('createPostButton');
    const createPostModal = document.getElementById('createPostModal');
    const closeModal = document.querySelector('.close');
    const createPostForm = document.getElementById('createPostForm');
    const contentSection = document.querySelector('.content');
    const successMessage = document.getElementById('successMessage');
    let editorInstance;

    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    // Initialize CKEditor 5
    ClassicEditor
        .create(document.querySelector('#content'))
        .then(editor => {
            editorInstance = editor;
        })
        .catch(error => {
            console.error('Error initializing CKEditor 5:', error);
        });

    // Fetch and display user's posts
    function fetchPosts() {
        fetch('http://localhost:8080/articles', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(articles => {
                postsGrid.innerHTML = '';
                console.log("user", sessionStorage.getItem('username'));

                console.log(articles);


                if (articles.length === 0) {
                    postsGrid.innerHTML = '<p>You have not posted any articles yet.</p>';
                } {
                    articles.forEach(article => {
                        if (article.author.username === sessionStorage.getItem('username')) {
                            const card = document.createElement('div');
                            card.className = 'post-card';

                            card.innerHTML = `
                        <img src="${article.imageLink || 'default-image.jpg'}" alt="${article.title}">
                        <h3>${article.title}</h3>
                        <p>${article.subtitle}</p>
                        <p>${article.body.substring(0, 100)}...</p>
                        <a href="article.html?id=${article.id}" class="read-more">Read Full Article</a>
                    `;

                            postsGrid.appendChild(card);
                        }

                    });
                }
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    // Show modal on "Create New Post" button click
    createPostButton.addEventListener('click', function () {
        createPostModal.style.display = 'block';
        contentSection.classList.add('blur');
    });

    // Close modal
    closeModal.addEventListener('click', function () {
        createPostModal.style.display = 'none';
        contentSection.classList.remove('blur');
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target == createPostModal) {
            createPostModal.style.display = 'none';
            contentSection.classList.remove('blur');
        }
    });

    // Handle form submission
    createPostForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Ensure CKEditor content is synced with the textarea
        editorInstance.updateSourceElement();

        const formData = {
            title: document.getElementById('title').value,
            subtitle: document.getElementById('subtitle').value,
            imageLink: document.getElementById('imageLink').value,
            body: editorInstance.getData()
        };

        fetch('http://localhost:8080/articles', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(article => {
                createPostModal.style.display = 'none';
                contentSection.classList.remove('blur');
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
                fetchPosts();
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    });
    // Function to fetch and display the logged-in user's articles
    async function fetchUserArticles() {
        try {
            const response = await fetch('/user/articles');
            if (!response.ok) {
                throw new Error('Failed to fetch user articles');
            }
            const articles = await response.json();
            displayArticles(articles);
        } catch (error) {
            console.error('Error fetching user articles:', error);
        }
    }


    // Initial fetch of posts
    fetchPosts();
});
