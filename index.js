const express = require('express');
const app = express();
const axios = require('axios');
const crypto = require('crypto');
const url = require("url");


app.get('/', (req, res) => {
    res.send({msg: 'Hello from apps and mobile test'});
});




const port = 5400;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});