require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const app = express();

// Enable CORS 
app.use(cors({ origin: '*' })); 

// Middleware to parse JSON
app.use(express.json());

// POST /api/onboard endpoint
app.post('/api/onboard', (req, res) => {
  const data = req.body;

  // Basic validation
  if (!data.fullName || !data.email || !data.companyName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log('Received onboarding data:', data);

  // DB or external API call


  // Send success response
  res.status(200).json({ message: 'OK', receivedData: data });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
