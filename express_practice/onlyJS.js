const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');

const app = express();
const port = 3000;

// Middleware to parse XML request body
app.use(bodyParser.text({ type: 'application/xml' }));

// Route to handle XML to JSON conversion
app.post('/convert', (req, res) => {
  const xmlData = req.body;

  // Parse XML to JSON
  xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error parsing XML');
    } else {
      // Send the JSON response
      res.json(result);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
