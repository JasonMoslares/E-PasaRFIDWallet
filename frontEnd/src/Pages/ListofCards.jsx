import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Card} from 'antd'
import { handleReadAll } from "../API";

const ListofCards = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        handleReadAll(setDataSource);

        const interval = setInterval(() => {
            handleReadAll(setDataSource);
        }, 2000);

        return () => clearInterval(interval);
    }, [])

    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/home');
    }

    const rfidTypes = ['Beep', 'EasyTrip', 'AutoSweep']

    return(
        <>
            <button type='button' className='returnButton' onClick={handleReturnHome}>Home</button>
            <div className='cards-container'>
                <div className='cards-type-container'>
                    {rfidTypes.map((type) => (
                        <Card key={type} title={type}>
                            <div className="cards-inner-container">
                                {dataSource.filter(card => card.rfidType === type)
                                        .map((card, index) => (
                                            <Card key={index}>
                                                <div className="card-balance">
                                                    <h1>Balance: ₱ {card.cardBalance}</h1>
                                                </div>
                                                <div className="card-info">
                                                    <h3>{card.cardNumber}</h3>
                                                    <h3>{card.rfidType}</h3>
                                                    <h3>{card.nickName}</h3>
                                                </div>
                                            </Card>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ListofCards