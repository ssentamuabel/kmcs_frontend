import React, {useState, useEffect, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import Button from './Button'


const SendSmsComponent  = ({onSend, onCancel, recipients }) =>{
    const [message, setMessage] = useState('')
    const [numbers, setNumbers] = useState("")
    const maxlength = 150;


    const {rights} = useContext(RightsContext)

    useEffect(() =>{
        
        if (Object.keys(recipients).length === 0)
        {
           
            onSend('The table should have some data')
        }
        const contacts = recipients.map((item)=>item.user.contact)
       
        setNumbers(contacts.toString())

    },[recipients] )

    const handleChange = (e) =>{
        const value = e.target.value

        if (value.length <= maxlength) {
            setMessage(value);
        }
    }
    const sendMessage = () =>{
        // console.log(numbers)
        if (message.length < 15){
            onSend("Failed: Message can't be less than 15 characters")
        }else{
            const msg = rights.perm.type? `KYUMA:${message}` : `KYUMSA:${message}`
            console.log(msg)
            onSend("Messages sent, for details check SMS module")
        }
        
    }
   
    return (
        <div className="dialogue-container">
            <div id="sms-dialogue">
                <h3>Message</h3>
                <div id="message-box">
                    <textarea  
                        name="msg" 
                        rows="6" cols="40" 
                        onChange={handleChange}
                        maxLength={maxlength}
                        placeholder='Type here not more than 150 characters'>
                        
                    </textarea>
                    <p>{message.length}/{maxlength}</p>
                </div>
                <div id="msg-buttons">
                    <Button text="Cancel" onClick={onCancel} id="info"/>
                    <Button text="Send" onClick={sendMessage}/>
                   
                </div>

            </div>

        </div>
    )
}

export default SendSmsComponent