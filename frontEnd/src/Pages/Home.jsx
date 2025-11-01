
import {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Card} from 'antd'
import { handleReadTotalBalance } from "../API"

const Home = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        handleReadTotalBalance(setBalance);

        const interval = setInterval(() => {
            handleReadTotalBalance(balance);
        }, 2000)

        return () => clearInterval(interval);

    }, [])

    const navigate = useNavigate();

    return(
        <>
            <Card>
                <div className="balance-space">
                    <Card>
                        <div className="balance-title">
                            <h1>Total Balance Across Cards: </h1>
                        </div>
                        <div className="balance-section">
                            <h2>{balance}</h2>
                        </div>
                    </Card>
                </div>
            </Card>
            <Card>
                <div className="functionalities-space">
                    <Card>
                        <Link to='/enrollCard'>Enroll Card</Link>
                    </Card>
                    <Card>
                        <Link to='/transfer/source/:cardNumber'>Transfer Funds</Link>
                    </Card>
                    <Card>
                        <Link to ='/view/cards'>Cards</Link>
                    </Card>
                    <Card>
                        <Link to='/transactions'>Transaction Logs</Link>
                    </Card>
                </div>
            </Card>
        </>
    );
}

export default Home