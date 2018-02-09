var express = require('express');
var app = express();
var path = require('path');
const PORT = process.env.PORT || 5000
app.use(express.static(__dirname));
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));