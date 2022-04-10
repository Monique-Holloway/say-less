const express = require('express');
const res = require('express/lib/response');
const { user } = require('pg/lib/defaults');
const PORT = process.env.PORT || 3000;
// "const models" (line 4) is the same as "const db (db for database)"
const models = require('./models');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(express.static('./public'));


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
        res.json({ user_id: user.id, success: true })
      } else {
        res.json({ error: 'incorrect password' })
      }
    })
  })
})


// Template engine configuration
app.set('view engine', 'ejs');



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
// app.listen(3000)