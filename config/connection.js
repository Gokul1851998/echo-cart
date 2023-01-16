// mongodb connect
const mongoose = require('mongoose');

// mongoose.connect('mongodb://0.0.0.0:27017/Keys');
mongoose.connect('mongodb+srv://Gokul:1234@cluster0.4bu5rrc.mongodb.net/cluster0?retryWrites=true&w=majority')
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))  