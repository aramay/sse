const mongoose = require('mongoose');
const { Schema } = mongoose;
// v-- REPLACE THE EMPTY STRING WITH YOUR LOCAL/MLAB/ELEPHANTSQL URI
const myURI = 'mongodb://localhost:27017/app';

// UNCOMMENT THE LINE BELOW IF USING MONGO
const URI = process.env.MONGO_URI || myURI;

// UNCOMMENT THE LINE BELOW IF USING POSTGRESQL
// const URI = process.env.PG_URI || myURI;


const messageSchema = new Schema({
  message: { type: String, required: true},
  password: { type: String, required: true}
},{timestamps: true});

// const userSchema = new Schema({
//   username: { type: String, required: true},
//   password: { type: String, required: true}
// })

const Messages = mongoose.model('Messages', messageSchema);
// const User = mongoose.model('User', userSchema)


module.exports = Messages; // <-- export your model
