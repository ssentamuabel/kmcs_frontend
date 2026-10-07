import React, {createContext, useState} from 'react'

export const RightsContext = createContext();


export const RightsProvider = ({children}) =>{
    const [rights, setRights] = useState({})


    return (
        <RightsContext.Provider value={{ rights, setRights }}>
            {children}
        </RightsContext.Provider>
    )
}

