import React, {useEffect, useState} from 'react'
import Select from '../components/SelectComponent'
import Button from '../components/Button'
import Table from '../components/PermissionTable'
import UserRole from '../components/UserRoleComponent'
import '../styles/common.css'




const Settings = ()=>{
    const [userData, setUserData] = useState([]);
    const [permissionsData, setPermissionsData] = useState([]);
    const [permissionOptions, setPermissionOptions] = useState([])
    const [activeRole, setActiveRole] = useState(null)
    const [loading, setLoading] = useState(true)

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
                    setPermissionsData(permissionsData);

                    // populate the permission array
                    const options = permissionsData.map((item, index) =>(
                        {value: index, name : item.name}
                    ))
                    setPermissionOptions(options)
                    
                    // console.log(permissionsData[0])
                    
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
    }, []);

    const handleRoleChange = (e) =>{
        setActiveRole(permissionsData[e.target.value])
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
                            name="role"
                            value ="Role"
                            onChange = {handleRoleChange}
                        />
                    </div>
                    
                    <Button text="Add" />

                </div>

                <div id="data-section" >
                    <div id="users">
                        <UserRole
                            data={userData}

                        />
                    </div> 
                    <div id="permissions">                
                        <Table 
                            role={activeRole}
                        />
                    </div>

                </div>       

            </div>            
        </div>
    )
}


export default Settings