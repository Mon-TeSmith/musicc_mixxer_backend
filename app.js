const express = require('express');
const repoContext = require('./repository/repository-wrapper');
const cors = require('cors');
const { validateSong } = require('./middleware/songs-validation');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const authUtils = require('./utilities/auth');
const hbs = require('hbs');
const authRouter = require('./routes/auth');

const app = express();

MongoClient.connect('mongodb://localhost', (err, client) => {
    if (err) {
        throw err;

    }

    const db = client.db('user-profiles');
    const users = db.collection('users');
    app.locals.users = users;
});

passport.use(new Strategy(
    (username, password, done) => {
        app.locals.users.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password != authUtils.hashPassword(password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, { id });
});


app.listen(5000, function () {
    console.log(`Server started on port: ${port}`);
});

app.get('/api/songs/:id', (req, res) => {
    const id = req.params.id;
    const songs = repoContext.songs.findSongById(id);
    return res.send(songs);
});

app.set('views', path.join(_dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(_dirname, 'views/partials'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);


app.post('/api/songs', [validateSong], (req, res) => {
    const newSong = req.body;
    const addedSong = repoContext.songs.createSong(newSong);
    return res.send(addedSong);
});

app.put('/api/songs/:id', [validateSong], (req, res) => {
    const id = req.params.id;
    const songPropertiesToUpdate = req.body;
    const updatedSong = repoContext.songs.updateSong(id, songPropertiesToUpdate);
    return res.send(updatedSong)
});
app.get('/api/songs', (req, res) => {
    const id = req.params.id;
    const songs = repoContext.songs.findAllSongs();
    return res.send(songs);
});
app.delete('/api/songs/:id', (req, res) => {
    const id = req.params.id;
    const updatedDataSet = repoContext.songs.deleteSong(id);
    return res.send(updatedDataSet);
});

