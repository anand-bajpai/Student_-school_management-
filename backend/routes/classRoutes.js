const express=require("express");
const router=express.Router();
const User=require("../models/User");
const School=require("../models/School");

router.post("/add",async(req,res)=>{
    try{
    const data=req.body;
    data.className=data.className.toLowerCase();
    data.className=data.className.charAt(0).toUpperCase()+data.className.slice(1); //cLLaS 1==>Class 1
    const userData=await User.findById(data.userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    const isClassExists=schoolData.classes.filter((el)=>{
        return el.className==data.className
    }).length>0        
    if(isClassExists){
        return res.send({success:false,message:"Class Already Exists"});
    }
    schoolData.classes.push({className:data.className,
        subjects:data.classSubjects
    })
    // console.log(schoolData);
    const updatedSchool=await schoolData.save();
    res.send({success:true,message:"Class Added Successfully",data:updatedSchool});}
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
    res.send({success:true,message:"Success",data:schoolData.classes});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

router.post("/delete",async(req,res)=>{
    try{
    const {userId,index}=req.body;
    const userData=await User.findById(userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    schoolData.classes=schoolData.classes.filter((el,ix)=>{
        return ix!=index
    })
    const updatedSchool=await schoolData.save();
    res.send({success:true,message:"Class Deleted Successfully",data:updatedSchool});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

router.post("/edit",async(req,res)=>{
    try{
    const {userId,index,updatedClassName,updatedClassSubjects}=req.body;
    const userData=await User.findById(userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    schoolData.classes[index].className=updatedClassName;
    schoolData.classes[index].subjects=updatedClassSubjects;
    const updatedSchool=await schoolData.save();
    res.send({success:true,message:"Class Updated Successfully",data:updatedSchool});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

module.exports=router;