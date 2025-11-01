import {Route, Routes} from 'react-router-dom'
import Login from '../../Pages/Login';
import Register from '../../Pages/Register';
import Home from '../../Pages/Home';
import Transfer from '../../Pages/Transfer';
import EnrollCard from '../../Pages/EnrollCard';
import ListofCards from '../../Pages/ListofCards';
import ViewCard from '../../Pages/ViewCard';
import UpdateCard from '../../Pages/UpdateCard';
import TransactionLogs from '../../Pages/TransactionLog';


function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/enrollCard" element={<EnrollCard />}></Route>
            <Route path="/transfer" element={<Transfer />}></Route>
            <Route path="/view/cards" element={<ListofCards />}></Route>
            <Route path="/view/:cardNumber" element={<ViewCard />}></Route>
            <Route path="/updateCard/:cardNumber" element={<UpdateCard />}></Route>
            <Route path="/transactions" element={<TransactionLogs />}></Route>
        </Routes>
    );
}

export default AppRoutes