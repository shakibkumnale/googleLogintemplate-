# 🎉 Google OAuth with JWT Authentication Boilerplate 🌐🔐

This boilerplate demonstrates how to implement Google OAuth 2.0 authentication in a Node.js application using Passport.js and JSON Web Tokens (JWT) instead of sessions. It includes token-based authentication, secure cookie handling, and user management.

## ✨ Features

- 🚀 Google OAuth 2.0 login integration
- 🔑 JWT-based authentication for access and refresh tokens
- 🔒 Secure cookie storage for tokens
- 🛡️ Middleware for protected routes
- 🔁 Logout functionality with cookie clearance

## ⚙️ Prerequisites

1. **🖥️ Node.js and npm/yarn installed**
2. **🍃 MongoDB database** (local or cloud)
3. **🔧 Google API Credentials**:
   - Go to the [Google Developer Console](https://console.cloud.google.com/).
   - Create a project and enable the **Google+ API** and **Google OAuth API**.
   - Configure the OAuth 2.0 Client ID and Client Secret.
   - Set the redirect URI to `http://localhost:3000/auth/google/callback`.

## 📦 Installation

1. Clone the repository or copy the code:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```env
   CLIENT_ID=<Your-Google-Client-ID>
   CLIENT_SECRET=<Your-Google-Client-Secret>
   JWT_SECRET=<Your-JWT-Secret-Key>
   MONGO_URI=<Your-MongoDB-Connection-String>
   NODE_ENV=development
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will run at `http://localhost:3000`.

## 🔌 API Endpoints

### 1️⃣ Google OAuth Login

- **Endpoint:** `/auth/google`
- **Method:** `GET`
- **Description:** Redirects the user to Google for login.

### 2️⃣ Google OAuth Callback

- **Endpoint:** `/auth/google/callback`
- **Method:** `GET`
- **Description:** Handles the callback from Google after login.
- **Response:**
  - Sets secure cookies for `accessToken` and `refreshToken`.
  - Redirects the user to the frontend (e.g., `http://localhost:5173/profile`).

### 3️⃣ Protected Routes

- **Middleware:** `authenticateToken`
- **Description:** Protects routes by validating the `accessToken` from cookies.

#### Example Protected Route

- **Endpoint:** `/profile`
- **Method:** `GET`
- **Response:** Returns the authenticated user's profile.

### 4️⃣ Login Success

- **Endpoint:** `/login/success`
- **Method:** `GET`
- **Middleware:** `authenticateToken`
- **Response:** Returns a success message with the authenticated user's details.

### 5️⃣ Logout

- **Endpoint:** `/logout`
- **Method:** `GET`
- **Description:** Clears the cookies for `accessToken` and `refreshToken` and redirects to the frontend.

## 🛠️ Usage

### 🌐 Frontend Integration

- Use the `/auth/google` endpoint for initiating Google login.
- After successful login, cookies (`accessToken` and `refreshToken`) will be set.
- For accessing protected routes like `/profile`, include the cookies in the request.

### 📄 Example Request

#### Fetching Profile Data

```javascript
fetch('http://localhost:3000/profile', {
  method: 'GET',
  credentials: 'include', // Ensures cookies are sent
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### 🏁 Handling Logout

- Call the `/logout` endpoint to clear the user's session.

## 🧩 Code Walkthrough

### Key Files

1. **`server.js`**

   - Sets up the Express server and middleware.
   - Implements Google OAuth strategy with Passport.js.
   - Handles token generation and cookie management.

2. **`models/User.js`**

   - Mongoose schema for storing user information.

3. **`config/db.js`**

   - Connects to the MongoDB database.

### Middleware: `authenticateToken`

- Extracts the `accessToken` from cookies.
- Verifies the token and attaches the user to the request object.
- Protects routes by ensuring only authenticated users can access them.

## 🔒 Security Considerations

- Use `secure: true` for cookies in production to enforce HTTPS.
- Use strong secrets for `JWT_SECRET` and rotate them periodically.
- Store `refreshToken` securely and consider implementing token revocation.

## 📈 Future Enhancements

- ⏳ Add token expiration handling (e.g., refresh access token using `refreshToken`).
- 🛡️ Implement database storage for `refreshToken` for enhanced security.
- 👥 Add role-based access control (RBAC) for user permissions.

## 🛠️ Troubleshooting

1. **❌ Error:** `redirect_uri_mismatch` 
   - Ensure the redirect URI in your Google Developer Console matches `/auth/google/callback`.

2. **❌ Error:** `Unauthorized` on protected routes
   - Check if `accessToken` is present in cookies and is valid.

3. **❌ Server not starting**
   - Ensure `MONGO_URI` and Google credentials are correctly set in the `.env` file.

## 📜 License

This project is licensed under the MIT License.

---

💻 Happy coding! 🚀

