
import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Card} from 'antd'
import {SquarePlus, MousePointer2, IdCard, ClipboardList} from "lucide-react";
import { handleReadTotalBalance } from "../API"

const Home = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        handleReadTotalBalance(setBalance);

        const interval = setInterval(() => {
            handleReadTotalBalance(setBalance);
        }, 2000)

        return () => clearInterval(interval);

    }, [])

    return(
        <>
            <Card>
                <div className="balance-space">
                    <Card className="balance-card">
                        <div className="balance-title">
                            <h1>Total Balance Across Cards: </h1>
                        </div>
                        <div className="balance-section">
                            <h2>₱ {balance}</h2>
                        </div>
                    </Card>
                </div>
            </Card>
            <Card>
                <div className="functionalities-space">
                    <Link to='/enrollCard' className="function-card">
                        <div className="icon-tile">
                            <SquarePlus className="function-icon" />
                            <span className="function-label">Enroll Card</span>
                        </div>
                    </Link>
                    <Link to='/transfer/' className="function-card">
                        <div className="icon-tile">
                            <MousePointer2 className="function-icon" />
                            <span className="function-label">Transfer Funds</span>
                        </div>
                    </Link>
                    <Link to='/view/cards' className="function-card">
                        <div className="icon-tile">
                            <IdCard className="function-icon" />
                            <span className="function-label">Cards</span>
                        </div>
                    </Link>
                    <Link to='/transactions' className="function-card">
                        <div className="icon-tile">
                            <ClipboardList className="function-icon" />
                            <span className="function-label">Transaction Logs</span>
                        </div>
                    </Link>
                </div>
            </Card>
        </>
    );
}

export default Home