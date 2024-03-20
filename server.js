const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'pass123',
      database : 'face-detection',
    }
  });

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send('Success');
})
//using 'json' instead of 'send' to get a json response
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

//register users
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
 
//user profile
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//takes entries put in by users
app.put('/image', (req, res) => { image.handleImagePut(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.Port || 3000, ()=> {
    console.log(`app is running on port ${process.env.PORT}`)
})
