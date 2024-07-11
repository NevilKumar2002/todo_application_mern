const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);
require('dotenv').config();

const userRouter = require('./routes/userRoutes');
const activityRouter = require('./routes/activityRoutes');

const app = express();
const MONGO_URI = process.env.MONGO_URI;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new MongoDbSession({
  uri: MONGO_URI,
  collection: 'sessions',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.use('/users', userRouter);
app.use('/activities', activityRouter);

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: 500, message: 'Logout failed', error: err.message });
    }
    res.clearCookie(process.env.SESSION_NAME);
    res.json({ status: 200, message: 'Logout successful' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
