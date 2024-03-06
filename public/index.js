const express = require('express');
const morgan = require('morgan');
const app=express();
//middleware
app.use(morgan('common'));
app.use(express.static('public'));
//top movie data
let topMovies=[
      {
            title:'3 Idiots',
            director:'Raj kumar Hirani' },
      {
              title:'PK',
              director:'Rajkumar Hirani'},
      {
            title:'Piku',
            director:'Shoojit Sircar'},
      {
            titile:'Devdas',
            director:'Sanjay Leela Bhansali' },
      {
            title:'Veer-Zaara',
            director:'Yash Chopra'},
      {
            title:'Bhaag Milkha Bhaag',
            director:'Rakeysh Omprakash Mehra'},
     {
             title:'Jodha Akbar',
             director:'Ashutosh Gowariker' } ,   
     {
              title:'Dangal',
             director:'Nitesh Tiwari'},
      {
              title:'Queen',
              director:'Vikas Bahl'},
     {
            title:'Jab We Met',
           director:'Imtiaz Ali'}];
           app.get('/',(req,res)=>{
            res.send('welcome to my movie club')
           });
           app.get('/documentation',(req,res)=>{
            res.sendFile('public/documentation.html',{root:__dirname});
           });
            app.get('/movies',(req,res)=>{
            res.json(topMovies);
           });
           //error handling middleware
           app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
          });
          //start the server
           app.listen(8080, () => {
            console.log('Your app is listening on port 8080.');
          });