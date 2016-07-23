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
    type:   {type: String, default: "goldfish"},
    size:   {type: String, default: "small"},
    colour: {type: String, default: "orange"},
    mass:   {type: Number, default: "0.005"},
    name:   {type: String, default: "Finn"}
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

  var animal = new Animal ({}); //goldfish

  // delete all animals before we start
  Animal.remove({});

  // but it gets horribly arsy what has to happen next...
  // with loads of nested callbacks - so I would
  // totally go named functions at this point.

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