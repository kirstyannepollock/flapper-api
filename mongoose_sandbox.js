'use strict';
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/sandbox");
var db = mongoose.connection;


db.on("error", function(err){
  console.log("connection error!", err)
});

db.once("open", function()
{
  console.log("connected to db");

  //all db code
  var Schema = mongoose.Schema;
  var AnimalSchema = new Schema
  ({
    type: String,
    size: String,
    colour: String,
    mass: Number,
    name: String
  });

  var Animal = mongoose.model("Animal", AnimalSchema);

  var elephant = new Animal
  ({
      type: "elephant",
      size: "big",
      colour: "grey",
      mass: 6000,
      name: "Lawrence"
  });

  elephant.save(function(error)
  {
    if(error){
      console.log("Error")
    }
    else{
      console.log("Saved");
    }

    db.close(function(){
      console.log("db connnection closed");
    });
  
  });

});