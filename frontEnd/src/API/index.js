import axios from 'axios'

export const handleLogin = (values, nav) => {
    axios.post('http://localhost:5000/login', values)
    .then(res => {console.log(res); localStorage.setItem('token', res.data.token); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleRegister = (values, nav) => {
    axios.post('http://localhost:5000/register', values)
    .then(res => {console.log(res); nav('/')})
    .catch(err => {console.log(err)})
}

export const handleReadAll = (setVarName) => {
    axios.get('http://localhost:5000/view/cards', {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleReadSingleCard = (id, setVarName) => {
    axios.get('http://localhost:5000/view/'+id, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); setVarName({rfidType: res.data.rfidType, 
                                                nickName: res.data.nickName, 
                                                cardNumber: res.data.cardNumber, 
                                                cardBalance: res.data.cardBalance})})
    .catch(err => {console.log(err)})
}

export const handleReadTotalBalance = (setVarName) => {
    axios.get('http://localhost:5000/home', {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleEnrollCard = (e, values, nav) => {
    e.preventDefault();
    axios.post('http://localhost:5000/enrollCard', values, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleUpdateCard = (e, id, values, nav) => {
    e.preventDefault();
    axios.put('http://localhost:5000/updateCard/'+id, values, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleDeleteCard = (id, nav) => {
    axios.delete('http://localhost:5000/deleteCard/'+id, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleTransfer = (id, values, nav) => {
    axios.post('http://localhost:5000/transfer/source/'+id, values, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleTransactionLogs = (setVarName) => {
    axios.get('http://localhost:5000/transactions', {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}