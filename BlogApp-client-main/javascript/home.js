document.addEventListener('DOMContentLoaded', function() {
    const featuredPostContainer = document.getElementById('featuredPostContainer');
    const postsContainer = document.getElementById('postsContainer');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Check if the elements exist before adding event listeners
    if (hamburger && navLinks) {
        // Toggle the navigation menu on click of the hamburger icon
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.parentElement.classList.toggle('responsive');
        });
    }

    // Fetch all articles
    fetch('http://localhost:8080/articles')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Set the first article as the featured post
                const featuredArticle = data[0];

                // Create the featured post card
                const featuredPostCard = document.createElement('div');
                featuredPostCard.classList.add('featured-post-card');

                // Add image
                const featuredPostImage = document.createElement('img');
                featuredPostImage.classList.add('featured-post-image');
                featuredPostImage.src = featuredArticle.imageLink || 'default-image.jpg';
                featuredPostImage.alt = featuredArticle.title;

                // Create content wrapper for featured post
                const featuredContentWrapper = document.createElement('div');
                featuredContentWrapper.classList.add('featured-content-wrapper');

                // Add title
                const featuredPostTitle = document.createElement('h2');
                featuredPostTitle.textContent = featuredArticle.title;
                featuredPostTitle.addEventListener('click', () => {
                    window.location.href = `article.html?id=${featuredArticle.id}`;
                });

                // Add subtitle
                const featuredPostSubtitle = document.createElement('p');
                featuredPostSubtitle.classList.add('featured-subtitle');
                featuredPostSubtitle.textContent = featuredArticle.subtitle;

                // Add body preview (first few lines)
                const featuredPostBodyPreview = document.createElement('p');
                featuredPostBodyPreview.classList.add('featured-post-body');
                const previewText = featuredArticle.body.substring(0, 150) + '...';
                featuredPostBodyPreview.textContent = previewText;

                // Add "Read Full Article" link
                const readMoreLink = document.createElement('a');
                readMoreLink.href = `article.html?id=${featuredArticle.id}`; // Link to the full article
                readMoreLink.classList.add('read-more');
                readMoreLink.textContent = 'Read Full Article';

                // Add author name
                const authorName = document.createElement('p');
                authorName.classList.add('author-name');
                authorName.textContent = `By ${featuredArticle.author.username}`;

                // Append elements to the featured post content wrapper
                featuredContentWrapper.appendChild(featuredPostTitle);
                featuredContentWrapper.appendChild(featuredPostSubtitle);
                featuredContentWrapper.appendChild(featuredPostBodyPreview);
                featuredContentWrapper.appendChild(readMoreLink);
                featuredContentWrapper.appendChild(authorName);

                // Append image and content wrapper to featured post card
                featuredPostCard.appendChild(featuredPostImage);
                featuredPostCard.appendChild(featuredContentWrapper);

                // Append featured post card to the container
                featuredPostContainer.appendChild(featuredPostCard);

                // Remove the featured article from the list
                data.shift();
            }

            // Generate other posts in grid format
            data.forEach(article => {
                // Create a card for each post
                const postCard = document.createElement('div');
                postCard.classList.add('post-card');

                console.log(article);
                

                // Add image
                const postImage = document.createElement('img');
                postImage.classList.add('post-image');
                postImage.src = article.imageLink || 'default-image.jpg';
                postImage.alt = article.title;

                // Add title
                const postTitle = document.createElement('h3');
                postTitle.textContent = article.title;
                postTitle.addEventListener('click', () => {
                    window.location.href = `article.html?id=${article.id}`;
                });

                // Add subtitle
                const postSubtitle = document.createElement('p');
                postSubtitle.classList.add('post-subtitle');
                postSubtitle.textContent = article.subtitle;

                // Add body preview (first few lines)
                const postBodyPreview = document.createElement('p');
                postBodyPreview.classList.add('post-body');
                const previewText = article.body.substring(0, 100) + '...';
                postBodyPreview.textContent = previewText;

                // Add "Read Full Article" link
                const readMoreLink = document.createElement('a');
                readMoreLink.href = `article.html?id=${article.id}`; // Link to the full article
                readMoreLink.classList.add('read-more');
                readMoreLink.textContent = 'Read Full Article';

                // Add author name
                const authorName = document.createElement('p');
                authorName.classList.add('author-name');
                authorName.classList.add('author-name');
                authorName.textContent = `By ${article.author && article.author.username ? article.author.username : 'Unknown Author'}`;


                // Append elements to post card
                postCard.appendChild(postImage);
                postCard.appendChild(postTitle);
                postCard.appendChild(postSubtitle);
                postCard.appendChild(postBodyPreview);
                postCard.appendChild(readMoreLink);
                postCard.appendChild(authorName);

                // Append post card to container
                postsContainer.appendChild(postCard);
            });
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            postsContainer.textContent = 'Failed to load posts.';
        });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
});
