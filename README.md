# Client Onboarding Form

A client onboarding form built with Next.js frontend and Express.js backend API. Features React Hook Form with Zod validation for a robust user experience.

## Project Structure

- **Frontend**: Next.js application with React Hook Form and Zod validation
- **Backend**: Express.js API server running on port 5000
- **Styling**: Tailwind CSS for modern, responsive design

## Features

- Complete form validation with Zod schemas
- React Hook Form integration for efficient form handling
- Responsive design with Tailwind CSS
- Backend API endpoint for form submission
- CORS enabled for cross-origin requests
- Form data persistence and error handling

## Form Fields

- **Full Name**: Required, 2-80 characters, letters/spaces/hyphens/apostrophes only
- **Email**: Required, valid email format
- **Company Name**: Required, 2-100 characters
- **Services**: Required, choose ≥1 from UI/UX, Branding, Web Dev, Mobile App
- **Budget**: Optional, integer between $100-$1,000,000
- **Project Start Date**: Required, must be today or later
- **Accept Terms**: Required checkbox

## Setup Instructions

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd onboarding-api
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_ONBOARD_URL=http://localhost:5000/api/onboard
```

### 4. Start the Backend Server
```bash
cd onboarding-api
npm start
```
The backend will run on http://localhost:5000

### 5. Start the Frontend Development Server
In a new terminal window:
```bash
npm run dev
```
The frontend will run on http://localhost:3000

### 6. Access the Application
Open http://localhost:3000 in your browser

## API Endpoints

### POST /api/onboard
- **URL**: `http://localhost:5000/api/onboard`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**: Form data in JSON format

#### Request Body Example
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "companyName": "Tech Solutions Inc",
  "services": ["UI/UX", "Web Dev"],
  "budgetUsd": 50000,
  "projectStartDate": "2025-01-15",
  "acceptTerms": true
}
```

#### Response
- **Success (200)**: `{ "message": "OK", "receivedData": {...} }`
- **Error (400)**: `{ "message": "Missing required fields" }`

## Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm start` - Start the Express server
- `node server.js` - Direct server execution

## Production Deployment

1. **Backend**: Deploy the `onboarding-api` folder to your server
2. **Frontend**: Update `NEXT_PUBLIC_ONBOARD_URL` to your production API endpoint
3. **Build**: Run `npm run build` to create production build
4. **Deploy**: Deploy the built application to your hosting platform

## Technologies Used

- **Frontend**: Next.js 13, React 18, TypeScript
- **Form Handling**: React Hook Form, Zod validation
- **Styling**: Tailwind CSS
- **Backend**: Express.js, Node.js
- **CORS**: Cross-origin resource sharing enabled
