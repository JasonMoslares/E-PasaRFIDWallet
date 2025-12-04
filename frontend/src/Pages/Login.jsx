import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Card, Form, Input} from 'antd'
import { handleLogin } from "../API"
import "../index.css"

const Login = () => {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('');

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const submitUser = async () => {
        try{
            const success = await handleLogin(values);
            if(success){
                navigate('/home');
            }
            else{
                setErrorMessage('Invalid email or password');
            }
        }
        catch(error){
            setErrorMessage('Server error: ', error);
        }
    }

    return(
        <Card>
            <div className="form-container">
                <div className="login-form-container">
                    <Form form={form} layout='vertical' onFinish={submitUser}>
                        <div className="login-form-title">
                            <h2>Log In</h2>
                        </div>
                        <Form.Item label='E-mail' 
                                    name='email' 
                                    rules={[{required: true, message: 'Email Address is Required'},
                                            {type: 'email', message: 'Enter a valid Email Address'}
                                    ]}>
                            <Input placeholder='Enter your email'
                                    value={values.email}
                                    onChange={(e) => setValues({...values, email: e.target.value})}/>
                        </Form.Item>

                        <Form.Item label='Password' name='password' rules={[{required: true, message: 'Please enter your password'}]}>
                            <Input.Password placeholder='Enter your password' visibilityToggle={true} 
                                            value = {values.password}
                                            onChange={(e) => setValues({...values, password: e.target.value})}/>
                        </Form.Item>

                        {errorMessage && (
                            <Form.Item>
                                <div className='error-message'>
                                    <h4>{errorMessage}</h4>
                                </div>
                            </Form.Item>
                        )}

                        <button type='submit' className='loginButton'>Log In</button>
                    </Form>
                </div>
            </div>
        </Card>
    );
}

export default Login