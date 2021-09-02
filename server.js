const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Serve static files
app.use(express.static(__dirname + '/dist/SISMO'));

// Send all requests to index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/SISMO/index.html'));
});

// default Heroku port
app.listen(process.env.PORT || 5000);