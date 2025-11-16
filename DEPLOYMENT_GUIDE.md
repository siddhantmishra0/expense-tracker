# Deployment Guide for Budget Tracker

This guide will help you deploy your Budget Tracker application on Vercel (Frontend) and Render (Backend).

## 🚀 Prerequisites

1. **MongoDB Atlas Account** - For database
2. **Vercel Account** - For frontend deployment
3. **Render Account** - For backend deployment
4. **GitHub Repository** - Your code should be pushed to GitHub

## 📋 Step-by-Step Deployment

### 1. Backend Deployment on Render

#### 1.1 Prepare Environment Variables

Create a `.env` file in your `BackEnd` folder with these variables:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your-super-secret-jwt-key
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
FRONTEND_URL=https://your-frontend-app.vercel.app
NODE_ENV=production
PORT=3000
```

#### 1.2 Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `expensetracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `BackEnd`

#### 1.3 Set Environment Variables in Render

In your Render service dashboard:

1. Go to "Environment" tab
2. Add these variables:
   - `DATABASE_URL`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `ACCESS_TOKEN_SECRET`: Another secure random string
   - `REFRESH_TOKEN_SECRET`: Another secure random string
   - `FRONTEND_URL`: Your Vercel frontend URL (update after frontend deployment)
   - `NODE_ENV`: `production`

### 2. Frontend Deployment on Vercel

#### 2.1 Prepare Environment Variables

Create a `.env` file in your `FrontEnd` folder:

```env
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

#### 2.2 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `FrontEnd`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 2.3 Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add:
   - `VITE_API_BASE_URL`: Your Render backend URL

### 3. Update URLs After Deployment

#### 3.1 Update Backend CORS

After getting your Vercel URL, update the CORS configuration in `BackEnd/src/app.js`:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://your-actual-vercel-app.vercel.app", // Replace with actual URL
].filter(Boolean);
```

#### 3.2 Update Render Environment Variables

Update the `FRONTEND_URL` in your Render service with the actual Vercel URL.

#### 3.3 Update Vercel Environment Variables

Update the `VITE_API_BASE_URL` in your Vercel project with the actual Render URL.

## 🔧 Configuration Files Added/Updated

### Backend Changes:

- ✅ Fixed JWT import in `authController.js`
- ✅ Updated database connection to use `DATABASE_URL`
- ✅ Enhanced `render.yaml` with all required environment variables
- ✅ Improved error handling in registration
- ✅ Created `env.example` for reference

### Frontend Changes:

- ✅ Enhanced `vite.config.js` for production build
- ✅ Created `vercel.json` for Vercel deployment
- ✅ Created `env.example` for reference

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors

**Solution**: Ensure your frontend URL is added to the `allowedOrigins` array in `BackEnd/src/app.js`

### Issue 2: Environment Variables Not Loading

**Solution**:

- For Vercel: Variables must start with `VITE_`
- For Render: Check the Environment tab in your service dashboard

### Issue 3: Database Connection Failed

**Solution**:

- Verify your MongoDB Atlas connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if the database name is correct

### Issue 4: Build Failures

**Solution**:

- Check the build logs in Vercel/Render
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## 📝 Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is accessible at Vercel URL
- [ ] API calls from frontend to backend work
- [ ] User registration/login works
- [ ] Database operations work
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly

## 🔒 Security Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Use strong, unique secrets** for JWT tokens
3. **Enable HTTPS** - Both Vercel and Render provide this by default
4. **Regularly rotate secrets** in production

## 📞 Support

If you encounter issues:

1. Check the deployment logs in Vercel/Render dashboards
2. Verify all environment variables are set correctly
3. Test API endpoints using Postman or similar tools
4. Check browser console for frontend errors

---

**Note**: Replace all placeholder URLs (`your-frontend-app.vercel.app`, `your-backend-app.onrender.com`) with your actual deployment URLs.

