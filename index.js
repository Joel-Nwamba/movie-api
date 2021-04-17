const express = require('express');
const  morgan = require('morgan');
const app = express();

app.use(morgan('common'));

//GET request

app.get('/', (req, res) => {
    res.send('Welcome to the top Movies');
});

app.use(express.static('public'));

//app.get('/documentation', (req, res) => {
    //res.sendFile('public/documentation.html', { root: __dirname});
//});


app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('something isn\t working!');
});

// listen for request

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});