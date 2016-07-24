'use strict';
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/sandbox");
var db = mongoose.connection;


db.on("error", function(err){
  console.log("connection error!", err)
});


function logClose(){
  console.log("db connnection closed");
}

function closeDb(error){    
  db.close(logClose);
}

function checkSaveError(error){
  if(error){
    console.log("Save Failed", error)
  }
  else{
    console.log("Saved");
  };
}

//{elephant : this.elephant}
function animalSave(error){  
    checkSaveError(error); 
    this.elephant.save(checkErrorAndCloseDb);
}

function checkErrorAndCloseDb(error){  
    checkSaveError(error);    
    closeDb();
}

//{animal: animal, elephant: elephant}
function saveAllChanges(){
  var params = {elephant : this.elephant};
  this.animal.save(animalSave.bind(params));
}

function createAnimalSchema(){
  var Schema = mongoose.Schema;
  var AnimalSchema = new Schema
  ({
    type:   {type: String, default: "goldfish"},
    size:   {type: String, default: "small"},
    colour: {type: String, default: "orange"},
    mass:   {type: Number, default: "0.005"},
    name:   {type: String, default: "Finn"}
  });

  return mongoose.model("Animal", AnimalSchema);
}


function mainCode(){
  console.log("connected to db");
  var Animal = createAnimalSchema();

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
  var params = {animal: animal, elephant: elephant};
  Animal.remove({}, saveAllChanges.bind(params));
}

//all db code
db.once("open", mainCode); 