import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Form, Select } from 'antd'
import { handleReadAll, handleTransfer } from "../API";

const Transfer = () => {
    const [cards, setCards] = useState([]);
    const [values, setValues] = useState({
        sourceCard: '',
        destinationCard: '',
        amount: ''
    });

    useEffect(() => {
        handleReadAll(setCards);

        const interval = setInterval(() => {
            handleReadAll(setCards);
        }, 2000)

        return () => clearInterval(interval);
    }, [])

    const navigate = useNavigate();

    const cancelTransfer = () => {
        navigate('/home');
    }

    const submitTransfer = () => {
        handleTransfer(values, setValues);
        navigate('/home');
    }

    return(
        <Card>
            <div className="form-container">
                <div className="transfer-form-container">
                    <Form layout='vertical'>
                        <div className="transfer-form-title">
                            <h2>Transfer</h2>
                        </div>
                        <Form.Item label='Source Card'
                                    name='sourceCard'
                                    rules={[{required: true, message: "Please select the source card"}]}>
                            <Select showSearch
                                    placeholder="Select or type a card"
                                    value={values.sourceCard}
                                    onChange={(value) => setValues({...values, sourceCard: value})}
                                    filterOption={(input, option) =>
                                        option?.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    allowClear>
                                        {cards.map((card, index) => (
                                            <Select.Option key={index} value={card.cardNumber}>
                                                {card.cardNumber} ({card.nickName})
                                            </Select.Option>
                                        ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label='Destination Card'
                                    name='destinationCard'
                                    rules={[{required: true, message: "Please select the destination card"}]}>
                            <Select showSearch
                                    placeholder="Select or type a card"
                                    value={values.destinationCard}
                                    onChange={(value) => setValues({...values, destinationCard: value})}
                                    onSearch={(value) => setValues({...values, destinationCard: value})}
                                    filterOption={(input, option) => 
                                        option?.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    allowClear>
                                        {cards.map((card, index) => (
                                            <Select.Option key={index} value={card.cardNumber}>
                                                {card.cardNumber} ({card.nickName})
                                            </Select.Option>
                                        ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label='Amount'
                                    name='amount'
                                    rules={[{required: true, message: "Enter an amount"},
                                            {type: Number, message: "Enter a valid amount"}
                                    ]}>
                            <Input placeholder="Enter an amount"
                                    value={values.amount}
                                    onChange={(e) => setValues({...values, amount: e.target.value})} />
                        </Form.Item>

                        <button type='button' className='transferButton' onClick={submitTransfer}>Transfer</button>
                        <button type='button' className='cancelButton' onClick={cancelTransfer}>Cancel</button>
                    </Form>
                </div>
            </div>
        </Card>
    );
}

export default Transfer