import api from "./api";

const AUTH_URL = process.env.REACT_APP_API_AUTH_URL || "http://localhost:4000";
const CARD_URL = process.env.REACT_APP_API_CARD_URL || "http://localhost:5000";

export const handleLogin = async (values) => {
    return api.post(`${AUTH_URL}/login`, values)
    .then(res => {console.log(res); 
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(res.data.user)); 
                return true;})
    .catch(err => {console.log(err); return false;})
}

export const handleRegister = async (values) => {
    return api.post(`${AUTH_URL}/register`, values)
    .then(res => {console.log(res); return true})
    .catch(err => {console.log(err); return false})
}

export const handleLogout = (nav) => {
    api.delete(`${AUTH_URL}/logout`, {headers: {'x-refresh-token': localStorage.getItem('refreshToken')}})
    .then(res => {console.log(res);
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user');
                nav('/')})
    .catch(err => {console.log(err)})
}

export const handleReadAll = (setVarName) => {
    api.get(`${CARD_URL}/view/cards`)
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleReadSingleCard = (id, setVarName) => {
    api.get(`${CARD_URL}/card/`+id)
    .then(res => {console.log(res); setVarName({rfidType: res.data.rfidType, 
                                                nickName: res.data.nickName, 
                                                cardNumber: res.data.cardNumber, 
                                                cardBalance: res.data.cardBalance})})
    .catch(err => {console.log(err)})
}

export const handleReadTotalBalance = (setVarName) => {
    api.get(`${CARD_URL}/home`)
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleEnrollCard = (values) => {
    return api.post(`${CARD_URL}/enrollCard`, values)
    .then(res => {console.log(res); return res.data.Message;})
    .catch(err => {console.log(err); 
                    if(err.response && err.response.data && err.response.data.Message){
                        return err.response.data.Message;
                    }
                    return "Server error";})
}

export const handleUpdateCard = (id, values, nav) => {
    api.put(`${CARD_URL}/updateCard/`+id, values)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleDeleteCard = (id, nav) => {
    api.delete(`${CARD_URL}/deleteCard/`+id)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleTransfer = (values, nav) => {
    api.post(`${CARD_URL}/transfer`, values)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

export const handleTransactionLogs = (setVarName) => {
    api.get(`${CARD_URL}/transactions`)
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

export const handleCardTransactionLogs = (id, setVarName) => {
    api.get(`${CARD_URL}/view/`+id)
    .then(res => {console.log(res); setVarName(res.data.logs)})
    .catch(err => {console.log(err)})
}