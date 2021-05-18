const express = require('express');
const  morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myMovies', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static('public'));

app.use(morgan('common'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to myFlix where you can check out all of your movies favourite');
});

//app.get('/documentation', (req, res) => {
    //res.sendFile('public/documentation.html', { root: __dirname});
//});

//Getting the list of all the movies
app.get('/movies', (req, res) => {
    Movies.find().then((movies)=> {
        res.status(201).json(movies);
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Gets the list of a signle movie 
app.get('/movies/:title', (req, res) => {
    Movies.findOne({title: req.params.title}).then((movie) => {
        res.json(movie);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get request of movie by genre
app.get('/movies/genre/:Name', (req, res) => {
    Movies.findOne({'Genre.Name': req.params.Name}).then((movie)=>{
        res.json(movie.Genre);
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get data of directors name
app.get('/movies/director/:Name', (req, res) => {
    Movies.findOne({'Director.Name': req.params.Name}).then((movie)=> {
        res.json(movie.Director);
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Allow users to register 
app.post("/user", (req, res) => {
    Users.findOne({ Username: req.body.Username}).then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }).then((user) =>{res.status(201).json(user)}).catch((error) => {
                console.error(error);
                res.status(500).send('Error" ' + error)
            })
        }
    })
  });

  //Get all users

  app.get('/user', (req, res) => {
      Users.find().then((users) => {
          res.status(201).json(users);
      }).catch((err) => {
          res.status(500).send('Error: ' + err)
      });
  });

  //Get a user by username

  app.get('/user/:username', (req, res) => {
      Users.findOne({ username: req.params.username})
      .then((user)=> {
          res.json(user);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Erro: ' + err);
      });
  });

//Put allow users to update their user information

app.put('/user/:username', (req, res) => {
 Users.findOneAndUpdate({ username: req.params.username}, {
     $set:
     {
         Username: req.body.Username,
         Password: req.body.Password,
         Email: req.body.Email,
         Birthday: req.body.Birthday
     }
 },
 {new: true}, (err, updatedUser) => {
     if(err) {
         console.error(err);
         res.status(500).send('Error: ' + err);
     } else {
         res.json(updatedUser)
     }
 })
});

//allow users to add movie to their list of favourite
app.post('/user/:username/movies/:MovieID', (req, res) => {
   Users.findOneAndUpdate({ username: req.params.username}, {
       $push: { FavoriteMovies: req.params.MovieID}
   },
   {new: true}, 
   (err, updatedUser) => {
       if(err) {
           console.error(err);
           res.status(500).send('Error: ' + err)
       } else {
           res.json(updatedUser);
       }
   })
});

//allow users to remove movies from the list

app.delete('/user/:username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ username: req.params.username}, {
        $pull: { FavoriteMovies: req.params.MovieID}
    },
    {new: true}, 
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err)
        } else {
            res.json(updatedUser);
        }
    })
});

//request to delete username
app.delete('/user/:username', (req, res) => {
    Users.findOneAndRemove({ username: req.params.username}).then((user) => {
        if(!user) {
            res.status(400).send(req.params.username + ' was not found');
        } else {
            res.status(200).send(req.params.username + ' was deleted.');
        }
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('something is not working!');
});

// listen for request

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});


