const express = require('express');
const  morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to myFlix');
});

app.use(express.static('public'));

app.use(morgan('common'));
app.use(bodyParser.json());

let topTenMovies = [{
    title: 'Avengers: Endgame',
    director: 'Anthony Russo & Joe Russo',
    genre: 'Action/Scifi'
},
{
    title: 'Justice Leage: Zack Snyder Cut',
    director: 'Zack Snyder',
    genre: 'Action'
},
{
    title: 'Godzilla: King Of Monsters',
    director: 'Michael Dougherty',
    genre: 'Scifi/Action'
},
{
    title: 'Wonder Woman',
    director: 'Patty Jenkins',
    genre: 'Action/Adventure'
},
{
    title: 'GodFather',
    director: 'Francis Ford Coppola',
    genre: 'Crime'
},
{
    title: 'Fight Club',
    director: 'David Fincher',
    genre: 'Drama/Comedy'
},
{
    title: 'Kill Bill',
    director: 'Quentin Torentino',
    genre: 'Action/Crime'
},
{
    title: 'Purple Fiction',
    director: 'Quentin Torentino',
    genre: 'Crime/Drama'
},
{
    title: 'All about Eve',
    director: 'Joseph L. Mankiewicz',
    genre: 'Drama'
},
{
    title: 'The Apartment',
    director: 'Billy Wilder',
    genre: 'Romance/Comedy'
}];

//users information

let user  = [
    {
        user: 'JoelNwamba',
        email: 'Joel.nwamba@gmail.com',
        password: 'joel23'
    }
];

//app.get('/documentation', (req, res) => {
    //res.sendFile('public/documentation.html', { root: __dirname});
//});

//Getting the list of all the movies
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

//Gets the list of a signle movie 
app.get('/movies/:Title', (req, res) => {
    res.json(topTenMovies.find((movie) => {
        return movie.title === req.params.Title
    }));
});

//Get request of movie by genre
app.get('/movies/genre/:name', (req, res) => {
    topTenMovies.find((movie)=> {
        if(movie.genre === req.params.name){
            res.json(movie);
        }
    })
});

//Get data of directors name
app.get('/movies/director/:name', (req, res) => {
    topTenMovies.find((movie) => {
      if (movie.director === req.params.name) {
        res.json(movie);
      } 
    })
});

//Allow users to register 
app.post('/users', (res, req) => {
    const newRegistration = req.body;
    
    if(!newRegistration.username) {
        res.status(404).send('username is needed');
    } else if(!newRegistration.email){
        res.status(404).send('email is required to proceed');
    }else if(!newRegistration.password) {
        res.status(404).send('password is required');
    } else if(!newRegistration.password.length < 6) {
        res.status(400).send('password cannot be longer than 6');
    } else {
        newRegistration.id = uuid.v4();
        user.push(newRegistration)
        res.status(201).send('Welcome to your new account');
    }
});

//Put allow users to update their user information

app.put('/users/:username', (res, req) => {
    let updateUser = user.find((username)=> {
        return username.user === req.params.user
    });
    if(updateUser){
        username.user = req.params.user
    } else if(updateUser.password){
        res.status(404).send('update a new password');
    } else {
        res.status(201).send('updated information');
    }
});

//allow users to add movie to their list of favourite
app.post('/users/:username/favorite/:movieID', (res, req) => {
    let favoriteMovie = req.body
    if(favoriteMovie === '') {
        res.status(404).send('The list is empty');
    } else {
        movieID.push(favoriteMovie);
        res.status(201).send('movie has been added');
    }
});

//allow users to remove movies from the list

app.delete('/users/:username/favorite/:movieID', (res, req) => {
    let deleteMovie = favorite.find((movie) => {
        return movie.movieID !== req.params.movieID
    });
    if(deleteMovie){
        mmovieDelete = favorite.filter((obj) => {
            return obj.movieID !== req.params.movieID
        })
        res.status(201).send('information deleted');
    }
});

//request to delete username
app.delete('/users/:username', (res, req) => {
    const newRegistration = req.body;
    if(!newRegistration) {
        res.status(404).send(req.body + ' is not provided');
    } else {
        res.status(201).send(req.body + ' deleted');
    }
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('something is not working!');
});

// listen for request

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});