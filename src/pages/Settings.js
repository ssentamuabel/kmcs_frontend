import React, {useEffect, useState} from 'react'
import Select from '../components/SelectComponent'
import Button from '../components/Button'
import Input from '../components/InputComponet'
import Table from '../components/PermissionTable'
import UserRole from '../components/UserRoleComponent'
import '../styles/common.css'
import { FaLessThanEqual } from 'react-icons/fa'





const Settings = ()=>{
    const [userData, setUserData] = useState([]);
    const [filteredData, setFilteredData] = useState([])   
    const [permissionsData, setPermissionsData] = useState([]);
    const [permissionOptions, setPermissionOptions] = useState([])
    const [loadPermissions, setLoadPermissions] = useState(false)   
    const [activeRole, setActiveRole] = useState(null)
    const [roleField, setRoleField] = useState(false)
    const [loading, setLoading] = useState(true)
    const [newRole, setNewRole] = useState('')

    useEffect(() => {
        const getUsersAndPermissions = async () => {
            try {
                const [usersResponse, permissionsResponse] = await Promise.all([
                    fetch('http://127.0.0.1:8000/user/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch('http://127.0.0.1:8000/permission/', {
                        method: 'GET',
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
                   
                    console.log(permissionsData[0])
                    
                } else {
                    console.log('Something went wrong');
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false)
            }
        };

        getUsersAndPermissions();
    }, [loadPermissions]);

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
        
        if (newRole){
            console.log(newRole)

            try{

                const response = await fetch('http://127.0.0.1:8000/permission/', {
                    method: 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    }, 
                    body: JSON.stringify({name: newRole})
                })

                if (response.ok){
                    const res = await response.json()
                    console.log(res)
                    setRoleField(false)
                    setLoadPermissions(!loadPermissions)
                }else{
                    console.log("Something went wrong")
                }

            }catch(error){
                console.log(error)
            }

        }

    }


    if (loading) {
        return <div>Loading...</div>;
    }

   
    return (
        <div className='page-container' >
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
                    
                    <Button text="Add" onClick={()=> setRoleField(true)} />
                    {roleField && <div id="add-role">
                        <Input 
                            placeholder="New Role"
                            name="new_role"
                            onChange ={(e) => setNewRole(e.target.value)}                         
                        
                        />
                        <Button text="Save" onClick={saveRole} />
                    </div>}
                    

                </div>

                <div id="data-section" >
                    <div id="users">
                        <UserRole
                            data={filteredData}
                            permissionOptions = {permissionOptions}

                        />
                    </div> 
                    <div id="permissions">                
                        <Table 
                            role={activeRole}
                            onPermissionUpdate={()=>setLoadPermissions(!loadPermissions)}
                        />
                    </div>

                </div>       

            </div>            
        </div>
    )
}


export default Settings