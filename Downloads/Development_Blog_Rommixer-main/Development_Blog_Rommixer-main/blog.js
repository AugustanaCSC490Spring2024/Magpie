document.addEventListener('DOMContentLoaded', function() {
    const posts = [
        {author: 'Ilyas', title: 'Our journey begins', date: '2024-02-26', content: 'Today, we start thinking about where to start in creating our project. A lot of questions going through our minds such as how to start, how to set up next.js, what features to include, what are the possible challenges we will face, how much of our technology do we know?', images: ['journey.png']},
        {author: 'Elnatan', title: 'Creating the home page', date: '2024-03-04', content: 'Understanding that the home page is prone to change in the future, we wanted to start by creating the home page for our project because that is the foundation for any web app. Include as many links to other pages in the home page that we believe we need, and we worked on making the home page appealing', images: ['home-page.png']},
        {author: 'Aymane', title: 'Signing up and login', date: '2024-03-12', content: 'Working on setting up the firebase, getting the configuration information and setting up the sign up and login pages. We are also working on the database to store the user information. We want to integrate google sign in and authorize only augustana.edu email domains.', images: ['magpie.gif']},
        {author: 'Aaron', title: 'Creating the profile page', date: '2024-03-18', content: 'We tried setting up the profile page but we faced a difficulty as it was not rendering. We realized the issue was that the format that next.js uses and react pages has changed in the new update. We had to rename each file to page.js and put it in the folder that the page is for.', images: ['personal.png']},
        {author: 'Ilyas', title: 'Dashboard', date: '2024-03-25', content: 'Created a sample dashboard page that the user will be routed to once they are logged in. The dashboard is the main page where users can look at other users and match with them.', images: ['image.png']},
        {author: 'Elnatan', title: 'Firestore', date: '2024-04-02', content: 'Created the firestore to store user profile for the profile picture, the user responses for the questionaire that we will allow the users to update anytime and also will be used later on for creating the matching algorithms. I also created the collection for the questions intended to allow the admins to modify the questions on their own page.', images: ['firestore.png']},
        {author: 'Aymane', title: 'Admin UI', date: '2024-04-10', content: 'After thinking about how to make our rommate application more extensive, I created the Admin UI which has the profile, customize questionaire, and all users button for now ', images: ['adminUI.png']},
        {author: 'Elnatan', title: 'Messaging', date: '2024-04-17', content: 'Created the Messaging feature that works between Admin and users for now, then later to be replicated between users as well. Using the firestore to store the messages sent and recieved using the sender ID and user ID. Is always up to date and allows for instant messaging. It fetches the right collection and using the context I created on firestore index, it orders the elements of message components', images: ['messaging.png']},
        {author: 'Aaron', title: 'About-Page', date: '2024-04-22', content: 'Created the About page where users or admin can learn about what our website is about, and the features it provides. It also has a contact us form where they can reach us about any inquiries. In addition to that, we have prepared a list of frequently asked questions that users or admin can browse through to learn more about how to use our application.', images: ['about-page.gif']},
        {author: 'Elnatan', title: 'Review-and-Rental', date: '2024-05-01', content: 'Created the reviews page that allows you to give a review for the app and chose a rating. You can also edit your own review or delete. It will calculate the total average rating at the end. I also created the rentals page that allows to create a listing and other users can email you if they are interested. The editing and deleting functionality works the same way. Everytime a user creates or updates a form, it will create a collection in the firestore to store the information. The design for the stars and the forms are created using the @mui library.', images: ['review_and_housing.png']},
        {author: 'Ilyas', title: 'Finalizing', date: '2024-05-15', content: 'Finalizing on the project, we made several changes such as created constant theme for user and admin side and making every single page mobile responsive. Also, other additional features such as adding my listing and my comments for rental and reviews, email portal to email targeted users for admin page, view agreement for the user to see what the admins uploaded, and other fixing on small bugs. Created match and friend request methods to allow admins to view matches and create datasheets to store important infomation.', images: ['journey.png']},
    ];

    function loadPosts() {
        const postsContainer = document.getElementById('posts');
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            let imagesHtml = post.images.map(image => `<img src="${image}" alt="${post.title}" class="post-image">`).join('');
            postElement.innerHTML = `
                <h2 class="post-title">${post.title}</h2>
                <p class="post-date">Posted by ${post.author} on ${post.date}</p>
                <p class="post-content">${post.content}</p>
                ${imagesHtml} <!-- Images will be inserted here -->
            `;
            postsContainer.appendChild(postElement);
        });
    }

    loadPosts();
});
