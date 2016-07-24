'use strict';
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/sandbox");
var db = mongoose.connection;
console.log("connected to db");

db.on("error", function(err){
  console.log("connection error!", err)
});

//=========== general mongoose save code ==========
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

function checkErrorAndCloseDb(error){  
    checkSaveError(error);    
    closeDb();
}

//=======================================================

function createAnimalSchema(Schema){
  var AnimalSchema = new Schema
  ({
    type:   {type: String, default: "goldfish"},
    colour: {type: String, default: "orange"},
    mass:   {type: Number, default: "0.005"},
    name:   {type: String, default: "Finn"}
  });

  return mongoose.model("Animal", AnimalSchema);
}

function createAnimalData(Animal)
{
  var elephant = new Animal
  ({
      type: "elephant",
      colour: "grey",
      mass: 6000,
      name: "Lawrence"
  });

  var animal = new Animal ({}); //goldfish

  var whale = new Animal({
      type: "whale",
      mass: 190500,
      name: "Fig"
    });

  return [
		{
			type: "mouse",
			color: "gray",
			mass: 0.035,
			name: "Marvin"
		},
		{
			type: "nutria",
			color: "brown",
			mass: 6.35,
			name: "Gretchen"
		},
		{
			type: "wolf",
			color: "gray",
			mass: 45,
			name: "Iris"
		},
		elephant,
		animal,
		whale
	];

}

//{Animal: Animal}
function saveAnimals(error, animals)
{
    this.Animal.create(this.animalData, 
    function(error, animals)
    {
      checkSaveError(error);
      console.log("created");
      closeDb();
    });
}

function mainCode(){
  
  var Schema = mongoose.Schema;
  var Animal = createAnimalSchema(Schema);
  var animalData = createAnimalData(Animal);

  // remove all existing and then save all changes
  Animal.remove({},	saveAnimals.bind({Animal: Animal, animalData: animalData}));
}

//all db code
db.once("open", mainCode); 