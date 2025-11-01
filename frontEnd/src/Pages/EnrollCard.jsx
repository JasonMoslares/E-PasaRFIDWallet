import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Card, Form, Input, Select} from 'antd'
import { handleEnrollCard } from '../API';

const EnrollCard = () => {
    const [values, setValues] = useState({
        rfidType: '',
        cardNumber: '',
        nickName: ''
    })

    const navigate = useNavigate();

    const enrollCard = () => {
        handleEnrollCard(values, navigate);
    }

    const cancelEnroll = () => {
        navigate('/home');
    }

    const handleCardNumberChange = (e) => {
        let input = e.target.value.replace(/\D/g, "");          // Replace all non-digits with empty space

        if(values.rfidType === "Beep" || values.rfidType === "EasyTrip"){
            input = input.replace(/(.{4})/g, "$1 ").trim();     // Group digits into 4 and separate them with a white space
        }

        setValues({...values, cardNumber: input})
    }

    const validateCardNumber =   (_, value) => {
        if(!values.rfidType){
            return Promise.reject("Please Select RFID Type First");
        }

        const numeric = value.replace(/\s/g, "");               // Replace all white spaces with empty space

        if(values.rfidType === 'Beep' && numeric.length !== 16){
            return Promise.reject("Beep requires a 16-digit card number");
        }

        else if(values.rfidType === 'EasyTrip' && numeric.length !== 12){
            return Promise.reject("Easytrip requires a 12-digit card number")
        }

        else if(values.rfidType === 'AutoSweep' && numeric.length !== 6){
            return Promise.reject("Autosweep requires a 6-digit card number")
        }
    }

    return(
        <Card>
            <div className="form-container">
                <div className="card-form-container">
                    <Form layout='vertical'>
                        <div className="card-form-title">
                            <h2>Add a Card</h2>
                        </div>
                        <Form.Item label='RFID Type'
                                    name='rfidType'
                                    rules={[{required: true}]}>
                            <Select placeholder="Select RFID Type"
                                    value={values.rfidType}
                                    onChange={(value) => {setValues({...values, rfidType: value})}}>
                                        <Select.Option value='Beep'>Beep</Select.Option>
                                        <Select.Option value='EasyTrip'>EasyTrip</Select.Option>
                                        <Select.Option value='AutoSweep'>AutoSweep</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label='Card Number'
                                    name='cardNumber'
                                    rules={[{validator: validateCardNumber}]}>
                            <Input placeholder="Enter the Card Number"
                                    value={values.cardNumber}
                                    onChange={handleCardNumberChange} />
                        </Form.Item>

                        <Form.Item label='Card NickName'
                                    name='nickName'
                                    rules={[{required: true, message: "Please Enter a NickName"}]}>
                            <Input placeholder="Enter a NickName for your Card"
                                    value={values.nickName}
                                    onChange={(e) => {setValues({...values, nickName: e.target.value})}} />
                        </Form.Item>

                        <button type="button" className="enrollButton" onClick={enrollCard}>Enroll Card</button>
                        <button type="button" className="cancelButton" onClick={cancelEnroll}>Cancel</button>
                    </Form>
                </div>
            </div>
        </Card>
    );
}

export default EnrollCard