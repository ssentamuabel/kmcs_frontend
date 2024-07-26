import React from 'react'


const SelectComponent = ({options,label, value, error, icon, ...props})=>{
    return (
        <>
            <div id="select-container" >
                <div id="input-icon">{icon}</div>    
                <select    {...props}>
                 <option value=''>Select  {label}</option>
                    {
                        options && options.map((item)=>(
                            <option key = {item.value} value={item.value}>{item.name}</option>
                        ))
                    }
                                    
                </select>           
            </div>
            {error && <span id="input-error">{error}</span>}
        
        </>
    )
}

export default SelectComponent