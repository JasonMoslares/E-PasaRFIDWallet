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

const transactionSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    sourceCard: {type: String, required: true},
    sourceCardName: {type: String, required: true},
    destinationCard: {type: String, required: true},
    destinationCardName: {type: String, required: true},
    amount: {type: Number, required: true},
    timestamp: {type: Date, default: Date.now()}
})

const Card = mongoose.model('Card', cardSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

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
    const {cardNumber} = req.params;

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
        return res.status(500).json({Message: "Server error: ", error});
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
        return res.status(500).json({Message: "Server error: ", error});
    }
})

// Read Transaction Logs
app.get('/transactions', authenticateToken, async(req, res) => {
    const userId = req.user.userId;

    try{
        const history = await Transaction.find({user: userId})
        .sort({timestamp: -1})

        return res.json(history);
    }
    catch(error){
        return res.status(500).json({Message: "Server error: ", error});
    }
})

// Create / Enroll Card
app.post('/enrollCard', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {rfidType, cardNumber} = req.body;
    
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
            rfidType: rfidType,
            nickName: nickName,
            cardNumber: cardNumber
        })

        return res.json({Message: "Card Enrolled Successfully", newCard})
    }
})

// Update Card Nickname
app.put('/updateCard/:cardNumber', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {cardNumber} = req.params;
    const {nickName} = req.body;

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
        return res.status(500).json({Message: "Server error: ", error});
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
        return res.status(500).json({Message: "Server error: ", error})
    }
})

// Transfer Balance
app.post('/transfer/source/:cardNumber', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {cardNumber} = req.params;
    const {destinationCard, amount} = req.body;

    try{
        const cardSource = await Card.findOne({cardNumber});
        const cardDestination = await Card.findOne({cardNumber: destinationCard});

        if(!cardSource || !cardDestination){
            return res.status(404).json({Message: "One or both cards not found"});
        }

        else if(cardSource.user.toString() !== userId){
            return res.status(403).json({Message: "Card is enrolled to other users"});
        }

        else if(cardSource.cardBalance < amount){
            return res.status(400).json({Message: "Insufficient funds"});
        }

        else{
            cardSource.cardBalance -= amount;
            cardDestination.cardBalance += amount;

            await cardSource.save();
            await cardDestination.save();
            
            await Transaction.create({
                user: userId,
                sourceCard: cardSource.cardNumber,
                sourceCardName: cardSource.nickName,
                destinationCard: cardDestination.cardNumber,
                destinationCardName: cardDestination.nickName,
                amount: amount,
                timestamp: Date.now()
            })

            return res.json({Message: "Transfer successful"});
        }
    }
    catch(error){
        return res.status(500).json({Message: "Server error: ", error});
    }
})

// Read Total Balance
app.get('/home', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    
    try{
        const cards = await Card.find({user: userId});

        let totalBalance = cards.reduce((acc, card) => acc + card.cardBalance, 0);

        return res.json(totalBalance);
        
    }
    catch(error){
        return res.status(500).json({Message: "Server error: ", error});
    }
})

