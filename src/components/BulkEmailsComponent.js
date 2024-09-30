import React, {useEffect, useState} from 'react'
import Button from './Button'
import Input from '../components/InputComponet'
import { CONFIG } from '../config'
const BulkEmailComponent = ({onSend, onCancel, recipients }) =>{
    const [message, setMessage] = useState('')
    const [subject, setSubject] = useState('')
    const [error, setError] = useState('')
    const [emails, setEmails] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    useEffect(()=>{
        if (Object.keys(recipients).length === 0){
            onSend('The Table should have some data')
        }
        const rec = recipients.map((item)=>item.user.email);

        setEmails(rec.toString())
    }, [recipients])



    const sendEmail = async() =>{
        console.log(emails)

        setIsLoading(true)

        if (subject.length < 10 || message.length < 10 ){
            setError("Subject and Message Fields should have some text")
        }

        try{

            const response = await fetch(`${CONFIG.backend_url}/messages/email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    recievers:emails, 
                    subject:subject, 
                    message:message,
                    type: 0
                }),
                credentials: "include",
            })

            if (response.ok){
                onSend("Message sent successfully")
            }else{
                onSend("Something went wrong")
            }

        }catch(error){
            onSend("Connection Problem")
        }finally{
            setIsLoading(false)
          
        }


        

        

    }

    return (
        <div className="dialogue-container">
            
            <div id="sms-dialogue">
                <h3>Email</h3>
                <div id="message-box" className="email-inputs">
                    <Input
                        placeholder='Subject'
                        onChange={(e)=>{setError(''); setSubject(e.target.value)}}  
                        error={error}
                     />
                    <textarea  
                        name="msg" 
                        rows="6" cols="40" 
                        onChange={(e)=>{setError('');setMessage(e.target.value)}}                    
                        placeholder='Type here the email message'>
                        
                    </textarea>

                </div>
                <div id="msg-buttons">
                    <Button text="Cancel" onClick={onCancel} id="info"/>
                    <Button 
                        text={isLoading ? 'Sending...' : 'Submit'}
                        disabled={isLoading}
                        onClick={sendEmail}/>
                </div>
            </div>

        </div>
    )
}

export default BulkEmailComponent