import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Table} from 'antd'
import { handleTransactionLogs } from "../API";

const TransactionLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        handleTransactionLogs(setLogs);

        const interval = setInterval(() => {
            handleTransactionLogs(setLogs);
        }, 2000);

        return () => clearInterval(interval);
    }, [])

    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/home');
    }

    const columns = [
        {
            title: 'Source Card',
            dataIndex: 'sourceCard',
            key: 'sourceCard'
        },
        {
            title: 'Name',
            dataIndex: 'sourceCardName',
            key: 'sourceCardName'
        },
        {
            title: 'Sent',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => `- ₱ ${value.toLocaleString()}`
        },
        {
            title: 'Destination Card',
            dataIndex: 'destinationCard',
            key: 'destinationCard'
        },
        {
            title: 'Name',
            dataIndex: 'destinationCardName',
            key: 'destinationCardName'
        },
        {
            title: 'Received',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => `+ ₱ ${value.toLocaleString()}` 
        },
        {
            title: 'Date / Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (value) => new Date(value).toLocaleString()
        }

    ]

    return(
        <>
            <button type="button" className="returnButton" onClick={handleReturnHome}>Home</button>
        
            <Table columns={columns}
                dataSource={logs}
                rowKey={(record) => record._id}
                pagination={{pageSize:10}}/>
        </>
    );
}

export default TransactionLogs