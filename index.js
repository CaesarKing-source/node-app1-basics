const express = require('express');
const path = require('path');
const connectToDB = require('./config/db');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'ejs');

app.use(express.static(path.join(path.resolve(), 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

connectToDB();
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: {
            value: 3,
            message: "Username must be at least 3 characters long"
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

const userModel = mongoose.model('users', userSchema);
const users = [];

app.get('/login', (req, res) => {
    const { tokenUser } = req.cookies;
    console.log(tokenUser);
    res.render('login');
})

app.post('/login', (req, res) => {
    res.cookie("tokenUser", 'iamin', {
        httpOnly: true,
        maxAge: 900000 // 15 minutes
    });
    res.redirect('/');
})

app.get('/', (req, res) => {
    res.render('index');

})

app.post('/', async (req, res) => {
    const { username, email } = req.body;
    users.push({ username, email });
    await userModel.create({
        username,
        email
    });
    res.send('user successfully added');
})

app.get('/users', (req, res) => {
    res.json(users);
})

app.listen(3000, () => console.log('Server is running...'))