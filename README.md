# Chatterly

Chatterly is a full-stack web application designed for language exchange. It connects users worldwide, allowing them to practice languages through a social feed, real-time chat, and video calls.

## Key Features

-   **User Authentication**: Secure sign-up and login with email/password and Google OAuth 2.0. Includes password recovery via email.
-   **Profile Management**: Users can create and update their profiles with a profile picture, bio, location, and specify their native and learning languages.
-   **Onboarding Flow**: A guided process for new users to set up their profiles and preferences.
-   **Social Feed**: Create posts with images and captions. View a feed of friends' posts, with the ability to like and comment.
-   **Friend System**: Discover recommended users, send and accept friend requests, and manage your friends list.
-   **Real-time Chat**: One-on-one instant messaging powered by Socket.IO, complete with message-seen status indicators.
-   **Video Calling**: Integrated WebRTC for peer-to-peer video calls directly within a conversation.
-   **Notifications**: Get notified about incoming friend requests.
-   **Customizable Theming**: A theme selector with 30+ pre-built themes from daisyUI for a personalized user experience.

## Tech Stack

### Backend

-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose
-   **Real-time Communication**: Socket.IO
-   **Authentication**: Passport.js (for Google OAuth), JSON Web Tokens (JWT), bcrypt
-   **Video Call Signaling**: Stream Chat SDK
-   **Email Service**: Nodemailer
-   **Runtime**: Node.js

### Frontend

-   **Library**: React (Vite)
-   **State Management**: Zustand and TanStack Query (React Query)
-   **Routing**: React Router
-   **Styling**: Tailwind CSS with daisyUI
-   **Real-time Communication**: Socket.IO Client
-   **HTTP Client**: Axios
-   **Image Uploads**: Cloudinary API

## Project Structure

The project is organized into two main directories:

-   `Frontend/`: Contains the React client application built with Vite.
-   `Backend/`: Contains the Node.js and Express.js server, which handles API logic, database interactions, and real-time communication.

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

-   Node.js (v16.20.1 or later)
-   npm
-   MongoDB instance (local or a cloud service like MongoDB Atlas)
-   Cloudinary account for image storage
-   Stream account for video signaling
-   Google OAuth credentials

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Veenas028/Chatterly.git
    cd chatterly
    ```

2.  **Create Backend Environment File:**
    Create a `.env` file in the `Backend/` directory and add the following variables:

    ```env
    PORT=5001
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET_KEY=<YOUR_JWT_SECRET>
    NODE_ENV=development

    # Google OAuth
    GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
    GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>

    # URLs
    BACKEND_BASE_URL=http://localhost:5001
    FRONTEND_BASE_URL=http://localhost:5173

    # Nodemailer (for password reset)
    EMAIL_USER=<YOUR_GMAIL_ADDRESS>
    EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>

    # Stream SDK (for video call signaling)
    STREAM_API_KEY=<YOUR_STREAM_API_KEY>
    STREAM_API_SECRET=<YOUR_STREAM_API_SECRET>
    ```

3.  **Create Frontend Environment File:**
    Create a `.env` file in the `Frontend/` directory and add the following variables:
    ```env
    VITE_BACKEND_BASE_URL=http://localhost:5001
    VITE_CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
    VITE_CLOUDINARY_UPLOAD_PRESET=<YOUR_CLOUDINARY_UPLOAD_PRESET>
    ```

4.  **Install Dependencies:**
    Navigate to the root directory (`chatterly/`) and run the install script, which installs dependencies for both the frontend and backend.
    ```bash
    npm install
    ```

### Running the Application

You will need to run the backend and frontend servers in separate terminals.

1.  **Start the Backend Server:**
    ```bash
    cd Backend
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:5001`).

2.  **Start the Frontend Development Server:**
    ```bash
    cd Frontend
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.
