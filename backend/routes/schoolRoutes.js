const express=require("express"); //requiring express
const router=express.Router();  //for creating routes in another file
const School=require("../models/School"); //to add data in School model
const User=require("../models/User");  //to add data in User model
const upload=require("../utils/multerSetup");
router.post("/add",upload.single("logo"),async(req,res)=>{
    try{
    const data=req.body;
    const isExist=await User.findOne({email:data.email}); //For finding email
    if(isExist){
        res.send({success:false,message:"Email Already Registered"})
        return;
    }
    const isSchoolRegistered=await School.findOne({name:data.name});
    if(isSchoolRegistered){
        res.send({success:false,message:"School Already Registered"});
        return
    }
    const school=new School({name:data.name,logo:req.file.filename})
    const schoolData=await school.save();
    const user=new User({email:data.email,password:data.password,role:"admin",school:schoolData._id})
    const userData=await user.save();
    res.send({success:true,message:"Scohol Created Successfully",data:userData});}
    catch(err){
        console.log(err); //Prining Error
        res.send({success:false,message:"Error",error:err}); //Sending response
    }
})

router.get("/dashboard/:userId",async(req,res)=>{
    const userId=req.params.userId;
    const userData=await User.findById(userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"})
    }
    res.send({success:true,message:"Success",data:{
        totalStudents:schoolData.students.length,
        totalTeachers:schoolData.teachers.length,
        totalSubjects:schoolData.subjects.length,
        totalClasses:schoolData.classes.length
    }})
})


module.exports=router;