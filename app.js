const express = require('express');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser');
const authRoutes =require('./routes/authRoutes');
const app = express();
const {requireAuth} =require('./middleware/authMiddleware');
const {checkUser} =require('./middleware/authMiddleware');
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/node-express-jwt-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// routes
app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

//cookies
app.get('/set-cookies',(req,res)=>{
// res.setHeader('Set-Cookie','newUser=true');
res.cookie('newUser',false);
res.cookie('newEmployee',true,{maxAge:1000*60*60*24,httpOnly:true});
res.send('you got the cookie');
});

app.get('/read-cookies',(req,res)=>{
const cookies=req.cookies;
console.log(cookies.newUser);
res.json(cookies);
});

