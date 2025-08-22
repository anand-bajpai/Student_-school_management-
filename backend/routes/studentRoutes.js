const express=require("express");
const router=express.Router();
const School=require("../models/School");
const User=require("../models/User");
router.post("/add",async(req,res)=>{
    const data=req.body;
    const userData=await User.findById(data.userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    const newStudent=new User({
        email:data.email,
        password:data.password,
        role:"student",
        school:userData.school
    })
    const studentData=await newStudent.save();
    schoolData.students.push({
        name:data.name,
        fatherName:data.fatherName,
        id:studentData._id,
        attendence:[],
        class:data.class
    })
    const updatedSchool=await schoolData.save();
    res.send({success:true,message:"Student Added Successfully",data:updatedSchool});
})

router.post("/all",async(req,res)=>{
     const data=req.body;
    const userData=await User.findById(data.userId);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }
    const studentData=[];
    for(let i=0;i<schoolData.students.length;i++){
        const studentId=schoolData.students[i].id
        const studentEmail=await User.findById(studentId);
        studentData.push({...schoolData.students[i],email:studentEmail.email})
    }
    res.send({success:true,message:"Success",data:studentData});
})

router.post("/mark-attendence",async(req,res)=>{
    const {id,action,className,date,subject}=req.body;
    const userData=await User.findById(id);
    if(!userData){
        return res.send({success:false,message:"User Not Found"});
    }
    const schoolData=await School.findById(userData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not Found"});
    }

    const updatedStudents=[];
    for(let i=0;i<schoolData.students.length;i++){
        const student=schoolData.students[i];
        if(student.id==id){
            student.attendence.push({className:className,date:date,action:action,subject:subject});
        }
        updatedStudents.push(student);
    }
    schoolData.students=updatedStudents
    const updatedSchool=await schoolData.save();
    console.log(updatedSchool)
    res.send({success:true,message:"Attendece Marked"});

})

router.get("/attendence/:studentId",async(req,res)=>{
    const studentId=req.params.studentId;
    const studentData=await User.findById(studentId);
    if(!studentData){
        return res.send({success:false,message:"Student Not Found"});
    }
    const schoolData=await School.findById(studentData.school);
    if(!schoolData){
        return res.send({success:false,message:"School Not FOund"});
    }
    const studentClass=schoolData.students.filter((el,ix)=>el.id==studentId)[0].class||""
    const teachersOfStudentClass=schoolData.teachers.filter((el,ix)=>{
        return (el.classSubjects.filter((el2)=>el2.name==studentClass)).length>0
    })
    // console.log(teachersOfStudentClass);
    const studentAttendence=schoolData.students.filter((el,ix)=>el.id==studentId)[0].attendence;
    // console.log(studentAttendence)
    const updatedStudentAttendence=studentAttendence.map((el,ix)=>{
         const teacher=teachersOfStudentClass.filter((el2,ix2)=>{
            return el2.classSubjects.filter((el3,ix3)=>el3.name==studentClass&& el3.subject.includes(el.subject)).length>0
        })[0]?.name;
        // console.log(ix,teacher);
         return {...el.toObject(),teacher}
    })
    // console.log(updatedStudentAttendence)
    res.send({success:true,message:"Success",data:updatedStudentAttendence})
})
module.exports=router;