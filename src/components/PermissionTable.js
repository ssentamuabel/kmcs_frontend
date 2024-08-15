import React, { useState, useEffect } from 'react';
import Button from '../components/Button'
import '../styles/components.css';
import '../styles/common.css';

const PermissionTable = ({ role , onPermissionUpdate }) => {
    const [permissions, setPermissions] = useState({});
    const [changes, setChanges] = useState(false)

    useEffect(() => {
        if (role) {
            setPermissions(role);
        }
    }, [role]);

    const isChecked = (permissionValue, bitValue) => {
        return (permissionValue & bitValue) === bitValue;
    };

    const handleChange = (e, permissionName, bitValue) => {
        
        const newPermissions = { ...permissions };
        const currentValue = newPermissions[permissionName];

        // Ensure the "view" checkbox (bit 1) is checked if any other is checked
        if (bitValue !== 1 && !isChecked(currentValue, 1)) {
            newPermissions[permissionName] = 1;
        } else if (e.target.checked) {
            newPermissions[permissionName] = currentValue | bitValue; // Set the bit
        } else {
            newPermissions[permissionName] = currentValue & ~bitValue; // Clear the bit
        }
        setChanges(true)
        // console.log(newPermissions)
        setPermissions(newPermissions);
    };


    const handleConfirm = async() => {

       try{
        const response = await fetch(`http://127.0.0.1:8000/permission/${permissions.id}`, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            }, 
            body: JSON.stringify(permissions)
        })

       

        if (response.ok){
            const jsondata = await response.json()
            setChanges(false)
            console.log(jsondata)
            onPermissionUpdate()
        }else{
            console.log("Something went wrong")
        }

       }catch(error){
            console.log(error)
       }
    }

    

    return (
        <div id="permission-table">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>View</th>
                            <th>Edit</th>
                            <th>Add</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {['info_1', 'info_2', 'info_3', 'program', 'activity', 'sms', 'settings', 'permission'].map(permissionName => (
                            <tr key={permissionName}>
                                <td>{permissionName}</td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={isChecked(permissions[permissionName], 1)}
                                        onChange={(e) => handleChange(e, permissionName, 1)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={isChecked(permissions[permissionName], 2)}
                                        onChange={(e) => handleChange(e, permissionName, 2)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={isChecked(permissions[permissionName], 4)}
                                        onChange={(e) => handleChange(e, permissionName, 4)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={isChecked(permissions[permissionName], 8)}
                                        onChange={(e) => handleChange(e, permissionName, 8)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    {role && changes &&  <Button text="Confirm changes" onClick={handleConfirm} />}
                    
                </div>
            </div>
        </div>
    );
};

export default PermissionTable;
