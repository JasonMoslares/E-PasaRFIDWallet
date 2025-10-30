import axios from 'axios'

export const handleLogin = () => {
    axios.post('http://localhost:5000/login')
    .then(res => {console.log(res)})
    .catch(err => {console.log(err)})
}

export const handleRegister = () => {
    axios.post('http://localhost:5000/register')
    .then(res => {console.log(res)})
    .catch(err => {console.log(err)})
}

export const handleReadAll = (setVarName) => {
    axios.get('http://localhost:5000/view/cards')
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleReadSingleCard = (id, setVarName) => {
    axios.get('http://localhost:5000/view/'+id)
    .then(res => {console.log(res); setVarName({rfidType: res.data[0].rfidType, 
                                                nickName: res.data[0].nickName, 
                                                cardNumber: res.data[0].cardNumber, 
                                                cardBalance: res.data[0].cardBalance})})
    .catch(err => {console.log(err)})
}

export const handleEnrollCard = (e, values, nav) => {
    e.preventDefault();
    axios.post('http://localhost:5000/enrollCard', values)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleUpdateCard = (e, id, values, nav) => {
    e.preventDefault();
    axios.put('http://localhost:5000/updateCard/'+id, values)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleDeleteCard = (id, nav) => {
    axios.delete('http://localhost:5000/deleteCard/'+id)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}