import React from 'react'


const SelectComponent = ({
    options,
    label,
    defaultValue=false,
    value='', 
    small, 
    error, 
    icon, ...props})=>{
    return (
        <>
            <div id="select-container" >
                {icon && <div id="input-icon">{icon}</div>  }
                  
                <select     {...props}>
                    {defaultValue ? (<option value={value}> {value}</option>): (<option value=''> {label}</option>)}
                 
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