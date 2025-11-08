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

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const cancelTransfer = () => {
        navigate('/home');
    }

    const submitTransfer = () => {
        handleTransfer(values, setValues);
        navigate('/home');
    }

    const validateAmount = (_, value) => {
        const selectedSourceCard = cards.find(card => card.cardNumber === values.sourceCard);

        if(!selectedSourceCard){
            return Promise.reject("Select a source card first");
        }

        const currentBalance = Number(selectedSourceCard.cardBalance);

        if(value === undefined || value === null || value === ""){
            return Promise.reject("Please enter an amount");
        }
        
        const numericValue = Number(value);

        if(isNaN(numericValue)){
            return Promise.reject("Amount must be a number");
        }

        if(numericValue > currentBalance){
            return Promise.reject(`Amount cannot exceed source card balance (₱ ${currentBalance})`)
        }

        return Promise.resolve();
    }

    return(
        <Card>
            <div className="form-container">
                <div className="transfer-form-container">
                    <Form form={form} layout='vertical' onFinish={submitTransfer}>
                        <div className="transfer-form-title">
                            <h2>Transfer</h2>
                        </div>
                        <Form.Item label='Source Card'
                                    name='sourceCard'
                                    rules={[{required: true, message: "Please select the source card"}]}>
                            <Select placeholder="Select or type a card"
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
                            <Select placeholder="Select or type a card"
                                    value={values.destinationCard}
                                    onChange={(value) => setValues({...values, destinationCard: value})}
                                    onSearch={(value) => setValues({...values, destinationCard: value})}
                                    filterOption={(input, option) => 
                                        option?.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    allowClear>
                                        {cards.filter(card => card.cardNumber !== values.sourceCard)
                                                .map((card, index) => (
                                                    <Select.Option key={index} value={card.cardNumber}>
                                                        {card.cardNumber} ({card.nickName})
                                                    </Select.Option>
                                        ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label='Amount'
                                    name='amount'
                                    rules={[{validator: validateAmount}]}>
                            <Input placeholder="Enter an amount"
                                    value={values.amount}
                                    onChange={(e) => setValues({...values, amount: e.target.value})} />
                        </Form.Item>

                        <button type='submit' className='transferButton'>Transfer</button>
                        <button type='button' className='cancelButton' onClick={cancelTransfer}>Cancel</button>
                    </Form>
                </div>
            </div>
        </Card>
    );
}

export default Transfer