// Dependencies
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// Load Config
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();
connectDB();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// Session middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Passport config
require('./config/passport')(passport);

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override (for PUT and DELETE requests)
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    };
    // above code from method-overide docs
}));

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

// Handlebars middleware
app.engine('.hbs', exphbs({ helpers: { formatDate, stripTags, truncate, editIcon, select }, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
// Index
app.use('/', require('./routes/index'))
// Auth
app.use('/auth', require('./routes/auth'))
// Story
app.use('/stories', require('./routes/stories'))


// Listener
app.listen(PORT, console.log(`Server listening in ${process.env.NODE_ENV} on PORT ${PORT}!`));