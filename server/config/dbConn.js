const mongoose = require("mongoose");


const connectDB = async () => {
    try{
      await mongoose.connect("mongodb+srv://Ahnibaba:ani0520@cluster0.ppecbmn.mongodb.net/techNotesDB?retryWrites=true&w=majority&appName=Cluster0")

    } catch (err) {
       console.log(err);
    }
}

module.exports = connectDB;



//mongodb://127.0.0.1:27017/techNotesDB