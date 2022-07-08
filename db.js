require('dotenv').config();
const mongoose = require("mongoose")

  // Database connection 
  function connectDB(){

    mongoose.connect(process.env.MONGO_CONNECTION_URL,)
      
      //PARSER ARE NO LONGER NEEDED TO CONNECT MONGODB
      //{ useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });

      
      const connection =mongoose.connection;
      
      mongoose.connection

        .once('open',function (){
          console.log("Database Connected");
          
        })
        .on('error',function (err){
          console.log("Connection Failed");
        });
      
      
    }

    module.exports =connectDB;