require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
global.DEBUG = true;
app.use(express.urlencoded({ extended: true, })); // This is important!
app.use(express.json());

const posts = [
    {
        username: 'Peter',
        title: 'Fat Cat'
    },
    {
        username: 'Phil',
        title: 'The Mat'
    }
];

app.get('/posts', authToken, (req, res) => {
    if(DEBUG) console.log('/posts.user: ' + req.user.name);
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post('/login', (req, res) => {
    // Authenticate User Now
    if(DEBUG) console.log(req.body);
    const username = req.body.username;
    if(DEBUG) console.log('req.body.username ' + username);
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET);
    if(DEBUG) console.log(`curl -H "Authorization: Bearer ` + accessToken + `" http://localhost:3000/posts`);
    res.json({accessToken: accessToken});
});

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        if(DEBUG) console.log('authToken().user: ' + JSON.stringify(user));
        req.user = user;
        next();
    });
}

app.listen(3000, () => console.log('server started'));