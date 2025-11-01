import {useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Card, Form, Input} from 'antd'
import { handleDeleteCard, handleUpdateCard } from "../API";

const UpdateCard = () => {
    const [values, setValues] = useState({
        nickName: ''
    })

    const {id} = useParams();

    const navigate = useNavigate();

    const updateCard = () => {
        handleUpdateCard(id, values, navigate);
    }

    const deleteCard = () => {
        handleDeleteCard(id, navigate);
    }

    const cancelUpdate = () => {
        navigate('/home');
    }

    return(
        <Card>
            <div className="form-container">
                <div className="update-card-form-container">
                    <Form layout='vertical'>
                        <div className="update-card-form-title">
                            <h2>Update Card Name</h2>
                        </div>
                        <Form.Item label='Card Name'
                                    name='nickName'
                                    rules={[{required: true, message: "Please Enter Your Desired Name for the Card"}]}>
                            <Input placeholder="Enter your desired name for the card"
                                    value={values.nickName}
                                    onChange={(e) => {setValues({...values, nickName: e.target.value})}} />
                        </Form.Item>

                        <button type="button" className="updateButton" onClick={updateCard}>Update</button>
                        <button type="button" className="deleteButton" onClick={deleteCard}>Delete</button>
                        <button type="button" className="cancelButton" onClick={cancelUpdate}>Cancel</button>
                    </Form>
                </div>
            </div>
        </Card>
    );

}

export default UpdateCard