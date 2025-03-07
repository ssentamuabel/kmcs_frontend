import React, {useEffect, useState, useContext} from 'react'
import {RightsContext} from '../contexts/RightsProvider'
import Alert from '../components/Alert'
import Select from '../components/SelectComponent'
import Button from '../components/Button'
import Input from '../components/InputComponet'
import Table from '../components/PermissionTable'
import UserRole from '../components/UserRoleComponent'
import '../styles/common.css'
import { CONFIG } from '../config'






const Permissions = ()=>{
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')
    const [userData, setUserData] = useState([]);
    const [filteredData, setFilteredData] = useState([])   
    const [permissionsData, setPermissionsData] = useState([]);
    const [permissionOptions, setPermissionOptions] = useState([])
    const [loadData, setLoadData] = useState(false)   
    const [activeRole, setActiveRole] = useState(null)
    const [roleField, setRoleField] = useState(false)
    const [loading, setLoading] = useState(true)
    
    const [newRole, setNewRole] = useState('')
    const {rights} = useContext(RightsContext)

    useEffect(() => {
        const getUsersAndPermissions = async () => {
            try {
                const [usersResponse, permissionsResponse] = await Promise.all([
                    fetch(`${CONFIG.backend_url}/user/`, {
                        method: 'GET',
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch(`${CONFIG.backend_url}/permission/`, {
                        method: 'GET',
                        credentials: 'include',                        
                        headers: {
                            'Content-Type': 'application/json',
                            
                        },
                    }),
                ]);

                if (usersResponse.ok && permissionsResponse.ok) {
                    const usersData = await usersResponse.json();
                    const permissionsData = await permissionsResponse.json();

                    // console.log(usersData);
                    // console.log(permissionsData);

                    setUserData(usersData);
                    if (!activeRole){
                        setFilteredData(usersData)
                    }
                    setPermissionsData(permissionsData);

                    // populate the permission array
                    const options = permissionsData.map((item, index) =>(
                        {value: item.id, name : item.name}
                    ))
                    setPermissionOptions(options)
                   
                    // console.log(permissionsData[0])
                    
                } else {
                    setError('Something went wrong')
                    setErrorAlert(true)
                }

            } catch (error) {
                setError(error.message)
                setErrorAlert(true)
            } finally {
                setLoading(false)
            }
        };

        getUsersAndPermissions();
    }, [loadData]);

    const handleRoleChange = (e) =>{
        
        if (e.target.value === 'Role'){
            setFilteredData(userData)
            setActiveRole(null)
        }else{
            const role = permissionsData.filter(item => (item.id == e.target.value))[0]

            const filteredUsers = userData.filter((item)=>(
                item.permission_name === role.name
            ))

            // console.log(filteredUsers)
            // console.log(role.name)

            setActiveRole(role)
            setFilteredData(filteredUsers)

        }
        
    }

    const saveRole = async() =>{
        setLoading(true)
        if (newRole){

            const role = rights.perm.type ? {name: newRole + '_', type:1} : {name: newRole, type: 0};

            try{

                const response = await fetch(`${CONFIG.backend_url}/permission/`, {
                    method: 'POST',
                    credentials: 'include',  
                    headers : {
                        'Content-Type' : 'application/json'
                    }, 
                    body: JSON.stringify(role)
                })

                if (response.ok){
                    const res = await response.json()
                    
                    setRoleField(false)
                    setLoadData(!loadData)
                }else{
                    setError("Something went wrong")
                    setErrorAlert(true)
                }

            }catch(error){
                setError(error.message)
                setErrorAlert(true)
            }finally{
                setLoading(false)
            }

        }

    }


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='page-container' >
            { 
                errorAlert && (<Alert 
                type='Error'
                message ={error}
                 onCancel={()=>{setErrorAlert(false)}}                     
                />)
             } 
            <div id="setting-container">
                <div id="top-section">
                    <div>                        
                        <Select 
                            options = {permissionOptions}
                            label = "Role"
                            defaultValue
                            name="role"
                            value ="Role"
                            onChange = {handleRoleChange}
                        />
                    </div>
                    
                    <Button text="Add" id="info" onClick={()=> setRoleField(true)} />
                    {roleField && <div id="add-role">
                        <Input 
                            placeholder="New Role"
                            name="new_role"
                            onChange ={(e) => setNewRole(e.target.value)}                         
                        
                        />
                        <Button 
                            text={loading ? 'Loading...' : 'Submit'} 
                            id="info" 
                            disabled={loading}
                            onClick={saveRole} 
                        />
                    </div>}
                </div>

                <div id="data-section" >
                    <div id="users">
                        <UserRole
                            data={filteredData}
                            permissionOptions = {permissionOptions}
                            loadUsers = {()=>setLoadData(!loadData)}

                        />
                    </div> 
                    <div id="permissions">                
                        <Table 
                            role={activeRole}
                            onPermissionUpdate={()=>setLoadData(!loadData)}
                        />
                    </div>

                </div>       

            </div>            
        </div>
    )
}


export default Permissions