import { useEffect, useState, useCallback } from 'react'
import Button from "../components/Button";
import Input from "../components/InputComponet";
import TextArea from '../components/TextAreaComponent';
import Select from '../components/SelectComponent';
import { CONFIG } from "../config";
import {
    FaPlus,
    FaTrashAlt


} from 'react-icons/fa'
import FinanceTable from '../components/Finance/FinanceTable';

const Finance = () => {

    const [entries, setEntries] = useState([])
    const [validationErrors, setValidationErrors] = useState({})
    const [programOptions, setProgramOptions] = useState([])
    
    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    };
    
    const [form, setForm] = useState({
        date: getTodayDate(),
        is_posted: false,
        reference: '',
        description: '',

    })


    useEffect(() => {
        
        getJournalEntries()
        getPrograms()
    }, [])


    const handleChange = (e) => {

        let value = e.target.value

        setForm({
            ...form,
            [e.target.name]: value
        })

    }


    const getJournalEntries = useCallback(async () => {

        try {

            const response = await fetch(`${CONFIG.backend_url}/api/v1/finance/jentry/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json();

                // console.log(data)
                setEntries(data)

            }

        } catch (err) {
            console.log(err)
        }

    })

    const getPrograms = useCallback(async() =>{

        try {

            const res =  await fetch(`${CONFIG.backend}/api/v1/programs/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok){

                console.log("We are here")
                const data = await res.json();

                console.log(data)
                // setEntries(data)
            }
            
        } catch (error) {
            console.log(error)
        }
    })


    const validatingForm = () => {
        const errors = {}

        if (!form.date) {
            errors.date = "Date is required"
        }

        if (!form.description) {
            errors.description = "Description is required"
        }

        if (!form.reference) {
            errors.reference = "Reference is required"
        }
    }

   
    return (
        <div className="page-container">
            <div className="finance-container">

                <div>
                    Dashboard summary and accounts
                </div>

                <div className="journal-form">
                    <Input
                        placeholder="Date"
                        name="date"
                        value={form.date}
                        type="date"
                        onChange={handleChange}
                        error={validationErrors.date}

                    />
                    <Input
                        placeholder="Reference"
                        name="reference"
                        value={form.reference}
                        onChange={handleChange}
                        error={validationErrors.reference}

                    />
                    <Input
                        placeholder="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        error={validationErrors.description}

                    />

                </div>

                <div style={{ maxHeight: "35%", overflowY: "scroll" }}>
                    <FinanceTable
                        data={entries}
                    />
                </div>

            </div>

        </div >
    )
}

export default Finance;