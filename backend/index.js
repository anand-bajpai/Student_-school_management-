const express=require("express");
const ConnectionToDb=require("./db/connectToDB");
const app=express();
const cors=require("cors");

//Requiring All Routes
const schoolRoute=require("./routes/schoolRoutes");
const authRoute=require("./routes/authRoutes");
const subjectRoute=require("./routes/subjectRoutes");
const classRoute=require("./routes/classRoutes");
const teacherRoute=require("./routes/teacherRoutes");
const studentRoute=require("./routes/studentRoutes");

ConnectionToDb();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("upload/"))
app.get("/",(req,res)=>{
    res.send("Server is running");
})

//Using Routes defined in another file
app.use("/school",schoolRoute);
app.use("/auth",authRoute);
app.use("/subject",subjectRoute);
app.use("/class",classRoute);
app.use("/teacher",teacherRoute);
app.use("/student",studentRoute)
//Starting Server at PORT 4400
app.listen(4400,()=>{
    console.log("Server is Running At PORT: 4400");
})