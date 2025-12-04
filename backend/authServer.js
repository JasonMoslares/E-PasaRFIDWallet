import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
.then(() => console.log("Database connected successfully"))
.catch((error) => console.log("DB Connection Error: ", error));

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    refreshToken: String
})

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(401).json({Message: "All fields are required"});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({Message: "User already exists"});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({name, email, password: hashedPassword});
            return res.status(201).json({Message: "User created successfully"})
        }
    }
    catch{
        res.status(500).json({Message: "Server error"});
    }
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(401).json({Message: "All fields are required"});
    }

    try{
        const user = await User.findOne({email});
        if(user && await bcrypt.compare(password, user.password)){
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET);
            user.refreshToken = refreshToken;
            await user.save();
            return res.status(200).json({Message: "Login successful", 
                                        user: {name: user.name,
                                                email: user.email,
                                                _id: user._id},
                                        accessToken,
                                        refreshToken });
        }
        else{
            return res.status(403).json({Message: "Invalid credentials"});
        }
    }
    catch{
        return res.status(500).json({Message: "Server error"});
    }
})

app.post('/token', async(req, res) => {
    const refreshToken = req.headers['x-refresh-token'];
    if(!refreshToken){
        return res.status(403).json({Message: "Token is missing"});
    }

    const user = await User.findOne({refreshToken});
    if(!user){
        return res.status(403).json({Message: "Invalid refresh token"});
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({Message: "Invalid refresh token"})
        }
        const accessToken = generateAccessToken(user);
        return res.status(200).json({ accessToken });
    })
})

app.delete('/logout', async(req, res) => {
    const refreshToken = req.headers['x-refresh-token'];
    if(!refreshToken){
        return res.status(403).json({Message: "Token is missing"});
    }

    await User.updateOne({refreshToken}, {$unset:{refreshToken:""}});

    return res.status(200).json({Message: "Logout successful"});
})

function generateAccessToken(user){
    return jwt.sign({userId: user._id, email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
}

app.listen(4000, () => {
    console.log("AuthServer is running");
})