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

// app.get('/', (req, res) => {
//   res.render('login');
// })

// Is this login on line 40 the name of the page you're logging 
// into for the get route or is it whatever name you want it to be?
app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/signup', (req, res) => {
  res.render('signUp');
})

// Do I need this to access create blog page? It's still not showing up once I click it.
app.get('/createNewBlog', (req, res) => {
  res.render('createNewBlog');
})

app.get('/forgotPass', (req, res) => {
  res.render('forgotPass');
})

// Was 'dashboard' on Juan's but mine is blogPage...do names need to match file names?
app.get('/blogPage', (req, res) => {
  // res.render('blogPage')
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  let user = req.session.user;

  models.Blog.findAll({
    where: {
      user_id: user.id
    },
  }).then(blogs => {
    res.render('blogPage', { locals: { username: user.username, blogs: blogs } });
  })
})

// app.get('/logout', (req, res) => {
//   req.session.destroy();
//   res.redirect('login');
// })

app.get('/blogs', (req, res) => {
  models.Blog.findAll().then((blogs) => {
    res.json(blogs);
  })
})

app.post('/signUp', (req, res) => {
/** (lines 82-85)
 * ES6 object deconstruct.
 * const username = req.body.username
 * const email = req.body.email
 * const password = req.body.password
 */

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

// tried creating delete route but uncertain about syntax
app.delete('/blogPage/:id', (req, res) => {
  const blog_id = number (req.params.id); 
  models.Blog.findByPk(blog_id).then((blog) => {
    if (blog.user_id == req.session.user.id) { 
    blog.destroy()
  } else {
    res.json({ error: 'cannot delete blog' })
  }
  })
})




// C.R.U.D
// app.get('/index.html', function (req, res) {
//   res.send('index.html')
// })

// app.get('/blogPage.html', function (req, res) {
//   res.send('blogPage.html')
// })





// app.get('/', (req, res) => {
  // The render method takes the name of the HTML
  // page to be rendered as input.
  // This page should be in the views folder
  // in the root directory.
  // res.render('blogPage');
  
   
  
//   });



app.listen(PORT, () => {
  console.log(`App started in port ${PORT}`)
})