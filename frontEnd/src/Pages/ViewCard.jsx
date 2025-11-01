import {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Card, Table} from 'antd'
import { handleCardTransactionLogs, handleReadSingleCard } from "../API"

const ViewCard = () => {
    const [value, setValues] = useState({
        cardNumber: '',
        nickName: '',
        rfidType: '',
        cardBalance: ''
    })
    
    const [logs, setLogs] = useState([]);

    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        handleReadSingleCard(id, setValues);
        handleCardTransactionLogs(id, setLogs);

        const interval = setInterval(() => {
            handleReadSingleCard(id, setValues);
            handleCardTransactionLogs(id, setLogs);
        }, 2000);

        return () => clearInterval(interval);
    }, [id])

    const handleReturnHome = () => {
        navigate('/home');
    }

    const columns = [
        {
            title: 'Source Card',
            dataIndex: 'sourceCard',
        },
        {
            title: 'Source Card Name',
            dataIndex: 'sourceCardName',
        },
        {
            title: 'Sent',
            dataIndex: 'amount',
            render: (value) => `- ₱ ${value.toLocaleString()}`
        },
        {
            title: 'Destination Card',
            dataIndex: 'destinationCard',
        },
        {
            title: 'Destination Card Name',
            dataIndex: 'destinationCardName',
        },
        {
            title: 'Received',
            dataIndex: 'amount',
            render: (value) => `+ ₱ ${value.toLocaleString()}`
        },
        {
            title: 'Date / Time',
            dataIndex: 'timestamp',
            render: (value) => new Date(value).toLocaleString()
        }
    ]

    return(
        <>
            <button type='button' className='returnButton' onClick={handleReturnHome}>Home</button>
            <div className="card-container">
                <Card>
                    <div className="card-inner-container">
                        <div className="card-balance">
                            <h2>₱ {Number(value.cardBalance).toLocaleString()}</h2>
                        </div>
                        <div className="card-info">
                            <h3>{value.cardNumber}</h3>
                            <h3>{value.rfidType}</h3>
                            <h3>{value.nickName}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <Table columns={columns}
                    dataSource={logs}
                    rowKey={(record) => record._id}
                    pagination={{pageSize: 10}} />
        </>
    );

}

export default ViewCard