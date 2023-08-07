const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Store links added by the teacher
let teacherLinks = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { role: req.session.role, teacherLinks });
});

app.get('/teacher', (req, res) => {
  if (req.session.role === 'teacher') {
    res.render('teacher');
  } else {
    res.redirect('/');
  }
});

app.post('/add-link', (req, res) => {
  if (req.session.role === 'teacher') {
    const link = req.body.link;
    teacherLinks.push(link);
  }
  res.redirect('/teacher');
});

app.get('/student', (req, res) => {
  res.render('student', { teacherLinks });
});

app.post('/login', (req, res) => {
  const role = req.body.role;

  if (role === 'teacher') {
    req.session.role = 'teacher';
  } else if (role === 'student') {
    req.session.role = 'student';
  }

  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
