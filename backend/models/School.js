const mongoose=require("mongoose");

const schoolSchema=mongoose.Schema({
    name:{type:String,unique:true,require:true},
    logo:String,
    classes:{type:[{
        className:String,
        subjects:[]
    }],default:[]},
    teachers:{type:[],default:[]},
    students:{type:[{
        name:String,
        fatherName:String,
        id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        attendence:{type:[{
            className:String,
            action:String,
            subject:String,
            date:String
        }],default:[]},
        class:String
    }],default:[]},
    subjects:{type:[],default:[]},
    adminDetails:{type:String}
})

const schoolModel=mongoose.model("school",schoolSchema);
module.exports=schoolModel;
