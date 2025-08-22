const express=require("express");
const router=express.Router();
const User=require("../models/User");
const School=require("../models/School");
router.post("/add",async(req,res)=>{
    try{
    const data=req.body;
    data.subjectName=data.subjectName.toLowerCase(); 
    data.subjectName=data.subjectName.charAt(0).toUpperCase()+data.subjectName.slice(1);
    const user=await User.findById(data.userId);
    if(!user){ 
        return res.send({success:false,message:"User Not Found"});
    }
    const school=await School.findById(user.school);
    if(!school){
        return res.send({success:false,message:"School Not Found"});
    }
    if(school.subjects.includes(data.subjectName)){
        return res.send({success:false,message:"Subject Is Already Added"});
    }
    school.subjects.push(data.subjectName);
    const updatedSchool=await school.save();
    res.send({success:true,message:"Subject Added Successfully",data:updatedSchool});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

router.get("/:userId",async(req,res)=>{
    try{
    const userId=req.params.userId;
    const userData=await User.findById(userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    res.send({success:true,message:"Success",data:schoolData.subjects});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

router.post("/delete",async(req,res)=>{
    try{
    const {subjectName,userId}=req.body;
    const userData=await User.findById(userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    let updatedSubjects=[];
    for(let i=0;i<schoolData.subjects.length;i++){
        if(schoolData.subjects[i]!=subjectName){

            updatedSubjects.push(schoolData.subjects[i]);
        }
    }
    schoolData.subjects=updatedSubjects;
    const updatedSchool=await schoolData.save();
    res.send({success:true,message:"Subject Deleted Successfully",data:updatedSchool});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }

})

router.post("/edit",async(req,res)=>{
    try{
    const {editIndex,updatedName,userId}=req.body;
    const userData=await User.findById(userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    schoolData.subjects[editIndex]=updatedName;
    const updatedSchool=await schoolData.save();
    res.send({success:true,message:"Subject Updated Successfully",data:updatedSchool});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

module.exports=router;