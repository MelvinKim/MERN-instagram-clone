const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGOURI } = require('./config/keys')
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

//fore development = 'mongodb://localhost:27017/Instagram-Clone'
mongoose.connect("mongodb://localhost:27017/Instagram-Clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Db connected successfully');
})
mongoose.connection.on('error', (err) => {
    console.log('error while connecting to Db', JSON.stringify(err, null, 2));
});

require("./models/userModel");
require('./models/postModel');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV == 'production'){
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'client','build', 'index.html'))
  })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})