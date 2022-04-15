const express = require('express');
const res = require('express/lib/response');
const { user } = require('pg/lib/defaults');
const PORT = process.env.PORT || 3000;
// "const models" (line 4) is the same as "const db (db for database)"
const bcrypt = require('bcrypt');
const models = require('./models');
const es6Renderer = require('express-es6-template-engine');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Template engine configuration
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(cookieParser())
app.use(session({
  secret: 'tacocat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 60000 * 60
  }
}))

app.get('/', (req, res) => {
  res.render('index');
})

// Is this login on line 40 the name of the page you're logging 
// into for the get route or is it whatever name you want it to be?
app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/signup', (req, res) => {
  res.render('signup');
})

// Was 'dashboard' on Juan's but mine is blogPage...do names need to match file names?
app.get('/blogPage', (req, res) => {
  res.render('blogPage')
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }



app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
})

// Ask if needed below?
app.get('/', function (req, res) {
  res.send('Welcome to my blog app')
})

/** (lines 22-23)
 * ES6 object deconstruct.
 * const username = req.body.username
 * const email = req.body.email
 * const password = req.body.password
 */
app.post('/signUp', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.json({ error: 'Username, Email, and Password required.' })
    return;
  }

  bcrypt.hash(password, 5, (err, hash) => {
    models.User.create({
      username: username,
      email: email,
      password: hash
    }).then((user) => {
      res.json({
        success: true,
        user_id: user.id
      })
    }).catch(e => {
      let errors = [];

      e.errors.forEach((error) => {
        errors.push(error.message)
      })

      res.json({ error: errors })
    })
  })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  models.User.findOne({
    where: { username: username }
  }).then((user) => {
    if (!user) {
      res.json({ error: 'no user with that username' })
      return;
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        req.session.user = user;
        res.json({ user_id: user.id, success: true })
      } else {
        res.json({ error: 'incorrect password' })
      }
    })
  })
})






// C.R.U.D
// app.get('/index.html', function (req, res) {
//   res.send('index.html')
// })

// app.get('/blogPage.html', function (req, res) {
//   res.send('blogPage.html')
// })





app.get('/', (req, res) => {
  // The render method takes the name of the HTML
  // page to be rendered as input.
  // This page should be in the views folder
  // in the root directory.
  res.render('blogPage');
  
   
  
  });

  app.listen(PORT, () => {
    console.log(`App started in port ${PORT}`)
  })
})
