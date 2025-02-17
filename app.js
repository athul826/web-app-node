
// 3. app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./config/database');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) {
      res.render('register', { error: 'Registration failed' });
    } else {
      res.redirect('/');
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) {
      res.render('login', { error: 'Invalid credentials' });
      return;
    }
    
    const match = await bcrypt.compare(password, results[0].password);
    if (match) {
      req.session.user = results[0];
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
    return;
  }
  res.render('dashboard', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
