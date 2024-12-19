const express=require('express');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Endpoint to handle form submission
app.post('/api/submit', (req, res) => {
  const { name,mail,password } = req.body;
  console.log(`Name: ${name}, Email: ${mail}, password: ${password}`);
  res.json({ message: 'Form submitted successfully!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
