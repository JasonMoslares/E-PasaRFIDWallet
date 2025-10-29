import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json())

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
.then(() => console.log("Database connected"))
.catch((error) => console.log("Error: ", error))

const cardSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    rfidType: {type: String, enum: ['Beep', 'EasyTrip', 'AutoSweep'], required: true},
    nickName: {type: String, unique: true, required: true},
    cardNumber: {type: String, unique: true, required: true},
    cardBalance: {type: Number, default: 0}
})

const Card = mongoose.model('Card', cardSchema);

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({Message: "No Token"});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({Message: "Invalid Token"});
        }
        req.user = user;
        next();
    })
}

// Read Single Card
app.get('/view/:cardNumber', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const cardNumber = req.params;

    try{
        const readCard = await Card.findOne({cardNumber});

        if(!readCard){
            return res.status(404).json({Message: "Card not found"});
        }

        else if(readCard.user.toString() !== userId){
            return res.status(403).json({Message: "Card belongs to other user"});
        }

        else{
            return res.json(readCard);
        }
    }
    catch (error){
        return res.status(500).json({Message: "Server error", error});
    }
})

// Read All Cards
app.get('/view/cards', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    
    try{
        const enrolledCards = await Card.find({user: userId});
        if(enrolledCards.length === 0){
            return res.status(404).json({Message: "There are no cards enrolled in this account"});
        }
        else{
            return res.json(enrolledCards);
        }
    }
    catch (error){
        return res.status(500).json({Message: "Server error", error});
    }
})

// Create / Enroll Card
app.post('/enrollCard', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {cardType, cardNumber} = req.body;
    
    const cardExists = await Card.findOne({cardNumber});
    if(cardExists){
        if(cardExists.user.toString() !== userId){
            return res.json({Message: "Card Already Enrolled on Other User"})
        }
        else{
            return res.json({Message: "Card Already Enrolled"})
    
        }
    }
    else{
        const newCard = await Card.create({
            user: userId,
            cardType: cardType,
            cardNumber: cardNumber
        })
    }
})

// Update Card Nickname
app.put('/updateCard/:cardNumber', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {cardNumber} = req.params;
    const nickName = req.body;

    try{
        const card = await Card.findOne({cardNumber});
        if(!card){
            return res.status(404).json({Messaage: "Card cannot be found"});
        }
        else if(card.user.toString() !== userId){
            return res.status(403).json({Message: "Card is enrolled to other users"});
        }
        else{
            card.nickName = nickName;
            await card.save();
            return res.json({Message: "Nickname updated successfully"});
        }
    }
    catch(error){
        return res.status(500).json({Message: "Server error", error});
    }
})

// Delete a Card
app.delete('/deleteCard/:cardNumber', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {cardNumber} = req.params;

    try{
        const card = await Card.findOne({cardNumber});
        if(!card){
            return res.status(404).json({Message: "Card not found"});
        }
        else if(card.user.toString() !== userId){
            return res.status(403).json({Message: "Card is enrolled to other users"});
        }
        else{
            await Card.deleteOne({cardNumber});
            return res.json({Message: "Card deleted successfully"})
        }
    }
    catch(error){
        return res.status(500).json({Message: "Server error", error})
    }
})