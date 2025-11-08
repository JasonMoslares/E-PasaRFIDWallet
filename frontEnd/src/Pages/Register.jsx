import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Card, Form, Input} from 'antd'
import { handleRegister } from "../API";

const Register = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const submitUser = async () => {
        try{
            const success = await handleRegister(values);
            if(success){
                navigate('/');
            }
            else{
                setErrorMessage('Email already exist!');
            }
        }
        catch(error){
            setErrorMessage('Server error: ', error);
        }
    }

    return(
        <Card>
            <div className="form-container">
                <div className="register-form-container">
                    <Form form={form} layout='vertical' onFinish={submitUser}>
                        <div className="register-form-title">
                            <h2>Register</h2>
                        </div>
                        <Form.Item label='Name'
                                    name='name'
                                    rules={[{required: true, message: "Please Enter Your Name"}]}>
                            <Input placeholder="Enter your name"
                                    value={values.name}
                                    onChange={(e) => setValues({...values, name: e.target.value})} />
                        </Form.Item>

                        <Form.Item label='Email'
                                    name='email'
                                    rules={[{required: true, message: "Email Address is Required"},
                                            {type: 'email', message: "Enter a valid Email Address"}
                                    ]}>
                            <Input placeholder="Enter your email address"
                                    value={values.email}
                                    onChange={(e) => {setValues({...values, email: e.target.value})}} />
                        </Form.Item>

                        <Form.Item label='Password'
                                    name='password'
                                    rules={[{required: true, message: "Please Enter Your Password"}]}>
                            <Input.Password placeholder="Enter your password"
                                            value={values.password}
                                            onChange={(e) => {setValues({...values, password: e.target.value})}} />
                        </Form.Item>

                        {errorMessage && 
                            <Form.Item>
                                <div className='error-message'>
                                    <h4>{errorMessage}</h4>
                                </div>
                            </Form.Item>
                        }

                        <button type='submit' className='registerButton'>Register</button>
                    </Form>
                </div>
            </div>
        </Card>
    );


}

export default Register