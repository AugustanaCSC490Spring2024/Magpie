# Roomixer - Roommate Matching Application
Welcome to **Magpie**, a comprehensive and intuitive roommate matching application designed to streamline the process of finding the perfect roommate. Whether you're a student, a young professional, or anyone in between, Magpie helps you find compatible roommates based on shared interests, lifestyle preferences, and more.

## Features

### Advanced Matching Algorithm
Magpie uses a sophisticated matching algorithm that takes into account various parameters to ensure compatibility. This includes preferences on cleanliness, noise levels, social habits, and more.

### Onboarding and Questionnaire
A seamless onboarding process with detailed questionnaires to gather essential information about users' preferences and requirements.

### User Profiles
Detailed user profiles with options to upload photos, provide descriptions, and list preferences.

### Email Portal
An advanced email portal for managing communications. It includes functionalities to email all users, matched users, unmatched users, reported users, and users who have or have not completed onboarding.

### Dashboard
A user-friendly dashboard that provides quick access to all the features and information.

### Reviews and Reports
Allows users to leave reviews and report issues, ensuring a safe and trustworthy community.

### Responsive Design
Fully responsive design that ensures a smooth user experience on both desktop and mobile devices.

## Technology Stack

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for production.
- **Material-UI**: React components for faster and easier web development.

### Backend
- **Firebase**: For authentication, Firestore for the database, and hosting.

### Other Tools
- **Splitwise API**: For managing shared expenses.
- **Git**: Version control system.

## Installation

### Prerequisites
- Node.js and npm installed.
- Firebase account and project set up.

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Magpie.git
   cd Magpie```
2. **Install dependencies**
   ```bash
   npm install
3. **Set up Firebase**
  - Create a new project on Firebase.
  - Set up Firestore, Authentication, and Hosting.
  - Generate a new web app and copy the Firebase configuration.
4. **Add configuration variables**
  - NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
5. **Run the development server**
  ```bash
  npm run dev
