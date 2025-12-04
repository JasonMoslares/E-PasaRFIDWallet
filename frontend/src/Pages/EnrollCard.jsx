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

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const enrollCard = () => {
        handleEnrollCard(values, navigate);
    }

    const cancelEnroll = () => {
        navigate('/home');
    }


    const getMaxLength = (type) => {
        if(type === "Beep"){
            return 16;
        }
        else if(type === "EasyTrip"){
            return 12;
        }
        else if(type === "AutoSweep"){
            return 6;
        }
    }

    const handleCardNumberChange = (e) => {
        let input = e.target.value.replace(/\D/g, "");          // Replace all non-digits with empty space
        
        const max = getMaxLength(values.rfidType);
        
        let format = input.slice(0, max);
        setValues({...values, cardNumber: format})
    }

    const handleKeyInputs = (e) => {
        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];

        if(allowed.includes(e.key)){
            return;
        }
        else if(!/^\d$/.test(e.key)){
            e.preventDefault();
        }
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

        return Promise.resolve();
    }

    return(
        <Card>
            <div className="form-container">
                <div className="card-form-container">
                    <Form form={form} layout='vertical' onFinish={enrollCard}>
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
                                    onChange={handleCardNumberChange}
                                    onKeyDown={handleKeyInputs}
                                    inputMode='numeric'
                                    type='text'
                                    maxLength={getMaxLength(values.rfidType)} />
                        </Form.Item>

                        <Form.Item label='Card NickName'
                                    name='nickName'
                                    rules={[{required: true, message: "Please Enter a NickName"}]}>
                            <Input placeholder="Enter a NickName for your Card"
                                    value={values.nickName}
                                    onChange={(e) => {setValues({...values, nickName: e.target.value})}} />
                        </Form.Item>

                        <button type="submit" className="enrollButton">Enroll Card</button>
                        <button type="button" className="cancelButton" onClick={cancelEnroll}>Cancel</button>
                    </Form>
                </div>
            </div>
        </Card>
    );
}

export default EnrollCard