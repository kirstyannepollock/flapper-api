'use strict';
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/sandbox");
var db = mongoose.connection;


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

// Recursively saves all items in the array passed in as "items".
// Bind params: {items: []} 
//              {items: [], first:true}  to stop the error 
//              check the first time round).
function arraySave(error){
  // really shouldn't do this the first time...  
    if(!this.first){
      checkSaveError(error); 
    }

    if(this.items.length > 1 ){
      var currItem = this.items.shift();
      var params = {items: this.items};
      currItem.save(arraySave.bind(params));
    }
    else{
      // last item
      var currItem = this.items.shift();
      currItem.save(checkErrorAndCloseDb);
    };    
}
//=======================================================

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
  var params = {items: [animal, elephant], first: true};
  
  // remove all existing and then save all changes
  Animal.remove({}, arraySave.bind(params));
  //Animal.remove({}, checkErrorAndCloseDb());


  // Animal.remove({}, function(err) 
  // {
	// 	if (err) console.error(err);

  //   db.close(function()
  //   {
  //     console.log("db connection closed");
  //   });

  // });


}

//all db code
db.once("open", mainCode); 