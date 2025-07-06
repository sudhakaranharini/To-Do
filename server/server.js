const express=require('express')
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken');
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
        if (
            !origin || 
            origin === "https://to-do-git-main-sudhakaranharinis-projects.vercel.app" ||
            origin === "https://to-do-ctkd.onrender.com" ||
            /\.vercel\.app$/.test(new URL(origin).hostname)
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    credentials: true
}));


const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log("database connected"))
.catch((error)=>{
    console.log(error.message)
})
const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true}
})
const todoModel=mongoose.model('todo',todoSchema)
const userSchema=new mongoose.Schema({
    username:{
        required:true,
        unique:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    otp: String,
    otpExpiry: Date
})
const userModel=mongoose.model('user',userSchema)

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
const middleware=(req,res,next)=>{
    const authheader=req.headers['authorization'];
    const token=authheader && authheader.split(' ')[1];
    if(!token) return res.status(401).json({message:"Token not provided"})
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(401).json({message:"Invalid Token"});
        req.user=user
        next();
})
}
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
app.post('/signup',async (req,res)=>{
    const {username,password,email}=req.body;
    try{
        const existing=await userModel.findOne({username});
        if(existing){
            return res.status(400).json({message:"UserName already exists"})
        }
        const hashedpassword=await bcrypt.hash(password,10)
        const user=new userModel({username,password:hashedpassword,email})
        await user.save();
        const token = jwt.sign({ id: user._id },process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: "User created successfully", token });

    }
    catch(error){
         res.status(500).json({ message: error.message })
    }
})
app.post('/login',async (req,res)=>{
    const {username,password}=req.body
    try{
        const user=await userModel.findOne({username})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const ispassvalid=await bcrypt.compare(password,user.password)
        if(!ispassvalid){
            return res.status(400).json({message:"Incorrect Password"})
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({message:"Login successfull",token})
    }catch (error) {
        res.status(500).json({ message: error.message });
    }


})
app.post('/forgot-password',async (req,res)=>{
    const {email} =req.body
        const user=await userModel.findOne({email:email})
        if(!user) return res.status(400).json({message:"user with this email is not found"});
        const otp=generateOTP();
        const otpExpiry=new Date(Date.now()+5*60*1000);
        user.otp=otp;
        user.otpExpiry=otpExpiry;
        await user.save()
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:'Your OTP for Password Reset',
            text:`Your OTP for password reset is :${otp}.It will expire in 5 mins`
        };
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
                return res.status(500).json({message:"Failed to send OTP "})
            }
            res.json({message:"OTP sent to email"})
        })

})
app.post('/reset-password',async (req,res)=>{
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
})
app.get('/todos',middleware,async (req,res)=>{
    try{
    const todos=await todoModel.find({userId: req.user.id})
    res.json(todos)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})
app.post('/todos',middleware,async (req,res)=>{
    const {title,description}=req.body
    try{
        const todo=new todoModel({title,description,userId:req.user.id})
        await todo.save()
        res.status(200).json(todo)
    }
    catch(error){
         res.status(500).json({message:error.message})
    }
})
app.put('/todos/:id',middleware,async (req,res)=>{
    const id=req.params.id
    const {title,description}=req.body
    try{
        const todo=await todoModel.findOneAndUpdate({_id:id,userId:req.user.id},{title,description},{new:true})
        res.status(200).json(todo)
    }
    catch(error){
         res.status(500).json({message:error.message})
    }
})
app.get('/todos/:id',middleware,async (req,res)=>{
    const id=req.params.id
    try{
        const todo=await todoModel.findOne({_id:id,userId:req.user.id})
        res.status(200).json(todo)
    }
    catch(error){
         res.status(500).json({message:error.message})
    }
})
app.delete('/todos/:id',middleware,async (req,res)=>{
    try{
        const id=req.params.id
        await todoModel.findOneAndDelete({_id:id,userId:req.user.id})
        res.status(204).end()
    }
    catch(error){
         res.status(500).json({message:error.message})
    }

})
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
