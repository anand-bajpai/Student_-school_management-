const mongoose=require("mongoose");

async function ConnectionToDb() {
    try{
    await mongoose.connect("mongodb://localhost:27017/School-Management-System")
    console.log("Connected To Database Successfully");}
    catch(err){
        console.log("Error",err);
    }
}


module.exports=ConnectionToDb;