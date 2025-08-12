import { useEffect, useState, useCallback } from "react";
import Button from "../components/Button";
import Input from "../components/InputComponet";
import Select from "../components/SelectComponent";
import TextArea from "../components/TextAreaComponent";
import { CONFIG } from "../config";
import AccountsTable from "../components/accounts/AccountsTable";
import { isEqual } from "../../src/utils/checkObjectValues";


const Accounts = () => {

    const [accounts, setAccounts] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [load, setLoad] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editObject, setEditObject] = useState({})


    const [form, setForm] = useState({
        name: '',
        account_type: '',
        code: '',
        description: '',
        balance: '',
        is_active: true,
    })


    const accountTypes = [
        { name: "CASH", value: "Cash" },
        { name: "BANK", value: "Bank" }

    ]

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {

        getAccounts();

    }, [load])


    const getAccounts = useCallback(async () => {
        try {
            const response = await fetch(`${CONFIG.backend_url}/api/v1/finance/account/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json();

                console.log(data);
                setAccounts(data)
            }
        } catch (error) {
            console.log(error)
        }
    })

    const handleEdit = (id) => {
        let obj = accounts.find(item => item.id === id)

        setEditObject(obj)
        setIsEdit(true);

        setForm({
            name: obj.name,
            account_type: obj.account_type,
            code: obj.code,
            description: obj.description,
            balance: obj.balance,
            is_active: obj.is_active,
        })

    }
    const handleSubmit = async () => {

        
        if (!validationForm()) return;

        console.table(editObject);
        console.table(form);

        if (
            form.name === editObject.name &&
            form.code === editObject.code &&
            form.account_type === editObject.account_type &&
            form.description === editObject.description &&
            Number(form.balance) === Number(editObject.balance) &&
            Boolean(form.is_active) === editObject.is_active
        )return;
       

        let url = isEdit 
            ? `${CONFIG.backend_url}/api/v1/finance/account/${editObject.id}/` 
            :  `${CONFIG.backend_url}/api/v1/finance/account/`

        

        console.table(form)
        console.log(url);

        setIsEdit(false)

        try {

            const response = await fetch(url,
                {
                    method: isEdit ? 'PUT' : 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form)
                }
            )

            if (response.ok) {
                setForm({
                    name: '',
                    account_type: '',
                    code: '',
                    description: '',
                    balance: '',
                    is_active: false,
                })

                setLoad(prev => !prev)

            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
            }

        } catch (error) {
            console.error("Network error:", error);
        }
    }

    const validationForm = () => {
        const errors = {}

        if (!form.name) {
            errors.name = "Name should be defined"
        }

        if (!form.account_type) {
            errors.account = "Account is needed"
        }

        if (!form.code) {
            errors.code = "Assign a code"
        }

        if (!form.description) {
            errors.description = "Assign a simple description"
        }

        if (!form.balance) {
            errors.balance = "Give an initial Account balance"
        }

        console.log("You reached  here")
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const changeAccountType = (e) =>{

        // console.log(e.target.value)

        setForm({...form, account_type: e.target.value})

    }



    return (
        <div className="page-container">
            <div className="accounts-container">
                <div className="accounts-dashboard">
                    Accounts
                </div>
                <div className="accounts-form">
                    <Input
                        placeholder="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={validationErrors.name}

                    />
                    <Select
                        options={accountTypes}
                        defaultValue = {isEdit ? true : false}                     
                        value={form.account_type}
                        name="account_type"
                        label="AccountType"
                        onChange={changeAccountType}
                        error={validationErrors.account_type}
                    />
                    <Input
                        placeholder="Code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        error={validationErrors.code}


                    />
                    <Input
                        placeholder="amount"
                        value={form.balance}
                        name="balance"
                        onChange={handleChange}
                        error={validationErrors.balance}

                    />

                    <TextArea
                        placeholder="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        error={validationErrors.description}
                    />

                    <Button text="submit" id="info" onClick={handleSubmit} />
                </div>

                <div className="add-btn">
                    <Button
                        text="Add Account"
                        id="info"
                    />
                </div>
                <div className="accounts-trasactions">
                    <AccountsTable
                        data={accounts}
                        handleEdit={handleEdit}
                    />
                </div>
            </div>
        </div>
    )
}

export default Accounts;