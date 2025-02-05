import React, {useState} from 'react'
import '../styles/common.css'

import Report from '../components/Program/Report'
import Planning from '../components/Program/Planning'




const Programs = ()=>{
    const [active, setActive] = useState(false)



    const handleActivePage = (value) =>{
        setActive(value)
       
    }
    return (
        <div className='page-container'>
            <div id='program-page'>
                <div className="toggle-switch">
                    <div className="title2" style={{paddingLeft:"0.8em"}}>
                        {active? "Planning" : "Reports"}
                    </div>
                    <label className="switch">
                        <input type="checkbox"/>
                        <span 
                            onClick={()=>handleActivePage(!active)} 
                            className="slider round">

                        </span>
                    </label>                   
                </div>
                <div style={{padding: "0.8em"}}>
                    {active ? (
                        <Planning />
                    ):(
                        <Report />
                    )}
                </div>            

            </div>       
        </div>
    )
}


export default Programs