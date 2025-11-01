import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Card, Form, Input} from 'antd'
import { handleLogin } from "../API"

const Login = () => {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const submitUser = () => {
        handleLogin(values, navigate)
    }

    return(
        <Card>
            <div className="form-container">
                <div className="login-form-container">
                    <Form layout='vertical'>
                        <div className="login-form-title">
                            <h2>Log In</h2>
                        </div>
                        <Form.Item label='email' 
                                    name='email' 
                                    rules={[{required: true, message: 'Email Address is Required'},
                                            {type: 'email', message: 'Enter a valid Email Address'}
                                    ]}>
                            <Input placeholder='Enter your email'
                                    value={values.email}
                                    onChange={(e) => setValues({...values, email: e.target.value})}/>
                        </Form.Item>

                        <Form.Item label='password' name='password' rules={[{required: true, message: 'Please enter your password'}]}>
                            <Input.Password placeholder='Enter your password' visibilityToggle={true} 
                                            value = {values.password}
                                            onChange={(e) => setValues({...values, password: e.target.value})}/>
                        </Form.Item>

                        <button type='button' className='loginButton' onClick={submitUser}>Log In</button>
                    </Form>
                </div>
            </div>
        </Card>
    );
}

export default Login