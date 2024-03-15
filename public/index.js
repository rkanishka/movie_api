const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require("./models.js");
const app = express();
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');


//mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb+srv://kanishkaraghuvanshi97:Krisha%4019@cluster0.clb9d16.mongodb.net/movieDB?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
//const authenticateJWT = require('./middleware/authenticateJWT');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com','*'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ 
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to my movie club');
});


// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get data of a specific movie
app.get('/movies/:movie_id',passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ _id: req.params.movie_id })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Add a new movie
app.post('/movies',passport.authenticate('jwt', { session: false }), (req, res) => {
  let newMovie = req.body;

  if (!newMovie.Title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    //newMovie._id = uuid.v4();
    Movies.create(newMovie);
    res.status(201).send(newMovie);
  }
});

// Update movie data
app.put('/movies/:Title/:director',passport.authenticate('jwt', { session: false }), (req, res) => {
  let movie = Movies.findOne( { Title: req.params.Title });

  if (movie) {
    movie.director = req.params.director;
    res.status(201).send('The director of the movie ' + req.params.Title + ' has been updated to ' + req.params.director);
  } else {
    res.status(404).send('Movie with the title ' + req.params.Title + ' was not found.');
  }
});


// Delete a movie
app.delete('/movies/:title',passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.deleteOne( { Title: req.params.Title })
    .then ((movie) =>  {
      res.status(200).send(req.params.title + ' was deleted');
    })
    .catch((err) => {
      res.status(404).send(req.params.title + ' was not found');
    });

});

// Get all users
app.get('/users',passport.authenticate('jwt', { session: false }), async (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:username',passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ name: req.params.username})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a new user
app.post('/users',[
 check('name',"Name is required of atleast 5 characters").isLength({min: 5}),
 check('name',"Name contains non- alphanumeric characters - not allowed").isAlphanumeric(),
 check('password','Password is required').not().isEmpty(),
 check('email','Email is not valid').isEmail()
],
 (req, res) => {
  let errors= validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }
  let hashedPassword = Users.hashPassword(req.body.password);
  let newUser = req.body;
  newUser.password = hashedPassword ;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    Users.create(newUser);
    res.status(201).send(newUser);
  }
});

// Update user data
app.put('/users/:Username/:newusername',passport.authenticate('jwt', { session: false }),(req, res) => {
  let newUser = Users.findOne({name: req.params.Username});

  if(newUser) {
    newUser.name = req.params.newusername;
   res.status(201).send('The username of the user ' + req.params.Username + ' has been updated to ' + req.params.newusername);
  } else {
   res.status(404).send("User with username " + req.params.Username + "was not found.");
  }
});

// Delete a user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),(req, res) => {

  Users.deleteOne( { name: req.params.Username })
    .then ((user) =>  {
      res.status(200).send(req.params.Username + ' was deleted');
    })
    .catch((err) => {
      res.status(404).send(req.params.Username + ' was not found');
    });
});

// Documentation endpoint
app.get('/documentation', (req, res) => {
  // Assuming you have a documentation file in the public folder
  // Adjust the path as needed
  res.sendFile('documentation.html', { root:'/Users/vtomar/movie_api/public' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
