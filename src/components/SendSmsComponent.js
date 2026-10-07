import React, {useState, useEffect, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import Button from './Button'
import { CONFIG } from '../config'


const SendSmsComponent  = ({onSend, onCancel, recipients }) =>{
    const [message, setMessage] = useState('')
    const [numbers, setNumbers] = useState("")
    const [isLoading, setIsLoading] = useState(false)
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
    const sendMessage = async() =>{
        // console.log(numbers)
        setIsLoading(true)
        if (message.length < 15){
            onSend("Failed: Message can't be less than 15 characters")
        }else{
            const msg = rights.perm.type? `KYUMA:${message}` : `KYUMSA:${message}`
            try{

                const response = await fetch(`${CONFIG.message_url}`, {
                    method: 'POST',                     
                    headers : {
                        'Content-Type' : 'application/json'
                    }, 
                    body: JSON.stringify({phone: numbers, message:msg, api_key: CONFIG.message_key})
                })

                if (response.ok){
                    const res = await response.json()
                    if (res.status === "success"){
                        onSend("Messages Sent successfully")
                    }
                }else{
                    onSend("Something went wrong")
                }

            }catch(error){
                onSend("Connection Error")
            }finally{
                setIsLoading(false)
            }
            
           
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
                    <Button 
                        text={isLoading ? 'Sending...' : 'Submit'}
                        disabled={isLoading}
                        onClick={sendMessage}/>
                   
                </div>

            </div>

        </div>
    )
}

export default SendSmsComponent