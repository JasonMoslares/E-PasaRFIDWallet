import api from "./api";

export const handleLogin = async (values) => {
    return api.post('http://localhost:4000/login', values)
    .then(res => {console.log(res); 
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(res.data.user)); 
                return true;})
    .catch(err => {console.log(err); return false;})
}

export const handleRegister = (values, nav) => {
    api.post('http://localhost:4000/register', values)
    .then(res => {console.log(res); nav('/')})
    .catch(err => {console.log(err)})
}

export const handleLogout = (nav) => {
    api.delete('http://localhost:4000/logout', {headers: {'x-refresh-token': localStorage.getItem('refreshToken')}})
    .then(res => {console.log(res);
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user');
                nav('/')})
    .catch(err => {console.log(err)})
}

export const handleReadAll = (setVarName) => {
    api.get('http://localhost:5000/view/cards')
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleReadSingleCard = (id, setVarName) => {
    api.get('http://localhost:5000/card/'+id)
    .then(res => {console.log(res); setVarName({rfidType: res.data.rfidType, 
                                                nickName: res.data.nickName, 
                                                cardNumber: res.data.cardNumber, 
                                                cardBalance: res.data.cardBalance})})
    .catch(err => {console.log(err)})
}

export const handleReadTotalBalance = (setVarName) => {
    api.get('http://localhost:5000/home')
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleEnrollCard = (values, nav) => {
    api.post('http://localhost:5000/enrollCard', values)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleUpdateCard = (id, values, nav) => {
    api.put('http://localhost:5000/updateCard/'+id, values)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleDeleteCard = (id, nav) => {
    api.delete('http://localhost:5000/deleteCard/'+id)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleTransfer = (values, nav) => {
    api.post('http://localhost:5000/transfer', values)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleTransactionLogs = (setVarName) => {
    api.get('http://localhost:5000/transactions')
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleCardTransactionLogs = (id, setVarName) => {
    api.get('http://localhost:5000/view/'+id)
    .then(res => {console.log(res); setVarName(res.data.logs)})
    .catch(err => {console.log(err)})
}