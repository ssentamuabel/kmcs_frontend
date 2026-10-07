import React, { useState, useEffect } from 'react';
import Button from '../components/Button'
import '../styles/permissionTable.css';
import { CONFIG } from '../config';
import {
    FaUserFriends, FaClipboardList, FaMoneyBillWave, FaRunning,
    FaEnvelope, FaWallet, FaUserShield, FaHandHoldingUsd, FaPhone
} from 'react-icons/fa';

// Maps each Permission model field to how it's shown in the matrix.
// (Only fields with a real backing column on the Permission model belong
// here — the previous version included a 'settings' row that had no
// matching model field at all, so it silently did nothing.)
const PERMISSION_ROWS = [
    { key: 'info_1', label: 'Member Info (Basic)', icon: <FaUserFriends /> },
    { key: 'info_2', label: 'Member Info (Contact)', icon: <FaPhone /> },
    { key: 'info_3', label: 'Member Info (Full Profile)', icon: <FaUserFriends /> },
    { key: 'program', label: 'Programs', icon: <FaClipboardList /> },
    { key: 'activity', label: 'Activities', icon: <FaRunning /> },
    { key: 'contribution', label: 'Contributions', icon: <FaHandHoldingUsd /> },
    { key: 'messages', label: 'Messages', icon: <FaEnvelope /> },
    { key: 'finance', label: 'Finance', icon: <FaMoneyBillWave /> },
    { key: 'budget_cost', label: 'Budget', icon: <FaWallet /> },
    { key: 'permission', label: 'Permissions (Admin)', icon: <FaUserShield /> },
];

const BIT_VIEW = 1, BIT_EDIT = 2, BIT_ADD = 4, BIT_DELETE = 8;

const PermissionTable = ({ role, onPermissionUpdate }) => {
    const [permissions, setPermissions] = useState({});
    const [changes, setChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (role) {
            setPermissions(role);
            setChanges(false);
        }
    }, [role]);

    const isChecked = (permissionValue, bitValue) => {
        return ((permissionValue || 0) & bitValue) === bitValue;
    };

    const handleChange = (permissionName, bitValue, checked) => {
        const newPermissions = { ...permissions };
        const currentValue = newPermissions[permissionName] || 0;

        // Any specific action implies View access too.
        if (bitValue !== BIT_VIEW && !isChecked(currentValue, BIT_VIEW) && checked) {
            newPermissions[permissionName] = BIT_VIEW | bitValue;
        } else if (checked) {
            newPermissions[permissionName] = currentValue | bitValue;
        } else {
            newPermissions[permissionName] = currentValue & ~bitValue;
        }
        setChanges(true);
        setPermissions(newPermissions);
    };

    const handleTypeChange = (value) => {
        setPermissions({ ...permissions, type: parseInt(value, 10) });
        setChanges(true);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${CONFIG.backend_url}/permission/${permissions.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(permissions)
            });

            if (response.ok) {
                setChanges(false);
                onPermissionUpdate();
            } else {
                console.error('Failed to save permission changes');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!role) {
        return (
            <div className="permission-matrix permission-matrix-empty">
                <FaUserShield size={32} />
                <p>Select a role above to view and edit its permissions</p>
            </div>
        );
    }

    return (
        <div className="permission-matrix">
            <div className="permission-matrix-header">
                <h3>{role.name}</h3>
                <div className="permission-matrix-header-controls">
                    <select
                        className="access-level-select"
                        value={permissions.type ?? 0}
                        onChange={(e) => handleTypeChange(e.target.value)}
                    >
                        <option value={0}>Student side</option>
                        <option value={1}>Alumni side</option>
                    </select>
                    {changes && (
                        <Button
                            id="info"
                            text={isLoading ? 'Saving…' : 'Save Changes'}
                            disabled={isLoading}
                            onClick={handleConfirm}
                        />
                    )}
                </div>
            </div>

            <div className="permission-table-scroll">
                <table className="permission-table-modern">
                    <thead>
                        <tr>
                            <th className="module-col">Module</th>
                            <th>View</th>
                            <th>Edit</th>
                            <th>Add</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PERMISSION_ROWS.map(({ key, label, icon }) => (
                            <tr key={key}>
                                <td className="module-col">
                                    <span className="module-icon">{icon}</span>
                                    <span>{label}</span>
                                </td>
                                {[BIT_VIEW, BIT_EDIT, BIT_ADD, BIT_DELETE].map(bit => (
                                    <td key={bit}>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={isChecked(permissions[key], bit)}
                                                onChange={(e) => handleChange(key, bit, e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PermissionTable;
