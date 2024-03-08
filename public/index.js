const express = require('express');
const morgan = require('morgan');
const app=express();

//middleware
app.use(morgan('common'));
app.use(express.static('public'));
//top movie data
let topMovies=[
      {
            id:1,
            title:'3 Idiots',
            director:'Raj kumar Hirani' },
      {        
              id:2,
              title:'PK',
              director:'Rajkumar Hirani'},
      {
            id:3,
            title:'Piku',
            director:'Shoojit Sircar'},
      {
            id:4,
            title:'Devdas',
            director:'Sanjay Leela Bhansali' },
      {     
            id:5,
            title:'Veer-Zaara',
            director:'Yash Chopra'},
      {      
            id:6,
            title:'Bhaag Milkha Bhaag',
            director:'Rakeysh Omprakash Mehra'},
     {
             id:7,
             title:'Jodha Akbar',
             director:'Ashutosh Gowariker' } ,   
     {
             id:8, 
            title:'Dangal',
             director:'Nitesh Tiwari'},
      {       
               id:9,
              title:'Queen',
              director:'Vikas Bahl'},
     {       
             id:10,
            title:'Jab We Met',
           director:'Imtiaz Ali'}];

      let User=[
                  {
                         id:1,
                         name:'aakrati'},
                  {
                        id:2,
                        name:'Bob'},
                  {
                          id:3,
                         name:'Veda'} ];

        app.get('/',(req,res)=>{
             res.send('welcome to my movie club')
          })   
            // Routes for movies
     app.get('/movies', (req, res) => {
      res.send('Successful GET request returning data on all the movies');
    });
    //get data of specific movie
    app.get('/movies/:movie_id', (req, res) => {
      const movieId = req.params.movie_id;
      res.send(`Successful GET request returning data on movie with ID ${movieId}`);
    });
    // add new movie
    app.post('/movies', (req, res) => {
      res.send('Successful POST request creating a new movie');
    });
    // update data
    app.put('/movies/:movie_id', (req, res) => {
      const movieId = req.params.movie_id;
      res.send(`Successful PUT request updating data on movie with ID ${movieId}`);
    });
    //delete movie 
    app.delete('/movies/:movie_id', (req, res) => {
      const movieId = req.params.movie_id;
      res.send(`Successful DELETE request deleting movie with ID ${movieId}`);
    });
    
    // Routes for users
    //list of all user
    app.get('/users', (req, res) => {
      res.send('Successful GET request returning data on all the users');
    });
    //get data of specific user
    app.get('/users/:user_id', (req, res) => {
      const userId = req.params.user_id;
      res.send(`Successful GET request returning data on user with ID ${userId}`);
    });
    //create new user
    app.post('/users', (req, res) => {
      res.send('Successful POST request creating a new user');
    });
    //updata data of ser
    app.put('/users/:user_id', (req, res) => {
      const userId = req.params.user_id;
      res.send(`Successful PUT request updating data on user with ID ${userId}`);
    });
    //delet user
    app.delete('/users/:user_id', (req, res) => {
      const userId = req.params.user_id;
      res.send(`Successful DELETE request deleting user with ID ${userId}`);
    });
    
          app.get('/documentation',(req,res)=>{
            res.sendFile('public/documentation.html',{root:'/Users/vtomar/movie_api'});
           })
          
           //error handling middleware
           app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
          });
          //start the server
           app.listen(8080, () => {
            console.log('Your app is listening on port 8080.');
          });
