const express=require("express");
const upload=require("../utils/multerSetup");
const School=require("../models/School");
const User=require("../models/User");
const router=express.Router();
router.post("/add",upload.single("profile"),async(req,res)=>{
    const data=req.body;
    const userData=await User.findById(data.userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    const isTeacherExists=await User.findOne({email:data.email});
    if(isTeacherExists) {
        return res.send({success:false,message:"Teacher Already Exists"});
    }
    const newTeacher=new User({
        email:data.email,
        password:data.password,
        school:userData.school,
        role:"teacher"
    })
    const teacherData=await newTeacher.save();
    schoolData.teachers.push({id:teacherData._id,name:data.name,profile:req.file.filename,
        classSubjects:JSON.parse(data.classSubjects)
    })
    const updatedSchool=await schoolData.save();
    res.send({success:true,message:"Teacher Added Successfully",data:updatedSchool});
})

router.post("/all",async(req,res)=>{
    try{
    const {userId}=req.body;
    const user=await User.findById(userId);
    if(!user){
        return res.send({success:false,message:"User Not Found"});
    }
    const school=await School.findById(user.school);
    if(!school){
        return res.send({success:false,message:"School Not Found"});
    }
    const temp=[...school.teachers];
    for(let i=0;i<temp.length;i++){
        let teacherId=temp[i].id;
        let teacherEmail=await User.findById(teacherId);
        temp[i].email=teacherEmail.email;
    }
    res.send({success:true,message:"Success",data:temp});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

router.post("/remove",async(req,res)=>{
    try{
    const {userId,index}=req.body;
    const user=await User.findById(userId);
    if(!user){
        return res.send({success:false,message:"User Not Found"});
    }
    const school=await School.findById(user.school);
    if(!school){
        return res.send({success:false,message:"School Not Found"});
    }
    if(!school.teachers[index]){
        return res.send({success:false,message:"No Teacher Data Found"});
    }
    await User.findByIdAndDelete(school.teachers[index].id);
    school.teachers=school.teachers.filter((el,ix)=>ix!=index);
    const updatedSchool=await school.save();
    res.send({success:true,message:"Teacher Deleted Successfully",data:updatedSchool});}
    catch(err){
        console.log(err);
        res.send({success:false,message:"Error",error:err.message});
    }
})

router.post("/getstudents",async(req,res)=>{
    const {userId}=req.body;
    const userData=await User.findById(userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    let teacherClasses=[];
    let teacher=schoolData.teachers.filter((el,ix)=>{
        return el.id==userId;
    })[0]
    teacherClasses=teacher.classSubjects.map((el)=>{
        return el.name;
    })
    let allStudents=schoolData.students.filter((el)=>{
        return teacherClasses.includes(el.class);
    })
    let updatedAllStudents=[];
    for(let i=0;i<allStudents.length;i++){
        const studentDetails=await User.findById(allStudents[i].id);
        updatedAllStudents.push({...allStudents[i].toObject(),email:studentDetails.email})
    }
    console.log(updatedAllStudents)
    res.send({success:true,message:"Success",data:updatedAllStudents});

})

router.get("/classes/:teacherId",async(req,res)=>{
    const teacherId=req.params.teacherId;
    const teacherData=await User.findById(teacherId);
    if(!teacherData){
        return res.send({success:false,message:"Teacher Not Found"});
    }
    const schoolData=await School.findById(teacherData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    const allClasses=schoolData.teachers.filter((el,ix)=>el.id==teacherId)[0].classSubjects
    res.send({success:true,message:"Success",data:allClasses})
})


module.exports=router;