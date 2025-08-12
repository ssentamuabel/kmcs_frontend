import { useEffect, useState } from 'react'
import Button from "../components/Button";
import Input from "../components/InputComponet";
import TextArea from '../components/TextAreaComponent';
import Select from '../components/SelectComponent';
import {
    FaPlus,
    FaTrashAlt


} from 'react-icons/fa'

const Transactions = () => {

    const [validationErrors, setValidationErrors] = useState({});
    const [lines, setLines] = useState([{ amount: '', description: '', account: '', entryType: '' }])

    const handleAddLine = () => {
        setLines([...lines, { amount: '', description: '', account: '', entryType: '' }])
    }

    const [entryForm, setEntryForm] = useState({
        date: '',
        reference: '',
        description: '',
        is_posted: false
    })


    const handleChange = (e) => {
        setEntryForm({
            ...entryForm,
            [e.target.name]: e.target.value
        })
    }


    const handleEntry = () => {

        if (!validationForm()) return;

        console.log(entryForm);

    }

    const handleLineDelete = () =>{
        console.log("We are deleting a ")
    }


    const handleLineChange = (index, field, value) =>{
        let updateLines = [...lines];

        updateLines[index][field] = value;

        setLines(updateLines)
    }


    const validationForm = () => {
        const errors = {};

        if (!entryForm.description) {
            errors.description = "Description is needed";
        }

        if (!entryForm.date) {
            errors.date = "The date is needed"
        }

        if (!entryForm.reference) {
            errors.reference = "Reference is needed";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;

    }



    return (
        <div className="page-container">
            <div className="finance-container">
                <div className="journal-entry-form">
                    <div className="title"><h3>Journal Entry</h3></div>

                    <div className="form-item">
                        <h4>Date: </h4>
                        <Input
                            placeholder="Date"
                            name="date"
                            type="date"
                            value={entryForm.date}
                            onChange={handleChange}
                            error={validationErrors.date}
                        />
                    </div>

                    <div className="form-item">
                        <h4>Reference: </h4>
                        <Input
                            placeholder="Reference"
                            name="reference"
                            value={entryForm.reference}
                            onChange={handleChange}
                            error={validationErrors.reference}
                        />

                    </div>
                    <div className="form-item">
                        <h4>Description: </h4>
                        <TextArea
                            placeholder="Description"
                            name="description"
                            value={entryForm.description}
                            onChange={handleChange}
                            error={validationErrors.description}

                        />
                    </div>
                    <div className="journal-line">
                        <div className="jouranal-header">
                            Journal-line
                        </div>

                        <div className="journal-line-form">
                            {
                                lines.map((line, index) => (
                                    <div className="journal-line-item" key={index}>
                                        <div className="form-item">
                                            <Select
                                                options={[{ value: 'Male', name: 'Male' }, { value: 'Female', name: 'Female' }]}
                                                label="Account"
                                                value={line.account}
                                            />
                                        </div>
                                        <div className="form-item">
                                            <Select
                                                options={[{ value: 'Male', name: 'Male' }, { value: 'Female', name: 'Female' }]}
                                                label="Entry Type"
                                                name="entryType"
                                                value={line.entryType}
                                                 onChange={(e) => handleLineChange(index, 'entryType', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-item">
                                            <Input
                                                placeholder="Amount"
                                                name="amount"
                                                value={line.amount}
                                                onChange={(e) => handleLineChange(index, 'amount', e.target.value)}
                                            />

                                        </div>
                                        <div className="form-item">
                                            <TextArea
                                                placeholder="Description"
                                                name="description"
                                                value={line.description}
                                                 onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                            />

                                        </div>
                                        <div className="form-item">
                                            <div className="delete-entry-line" onClick={handleLineDelete}>
                                                <FaTrashAlt   size={18} />
                                            </div>                                            
                                        </div>

                                    </div>

                                ))
                            }

                            <div className="add-entry-line" onClick={handleAddLine}>
                                <FaPlus size={18} /> Add Line Item
                            </div>                           

                        </div>

                    </div>
                    <Button
                        text="submit"
                        id="info"
                        onClick={handleEntry}
                    />

                </div>

                <div className="finance-actions">
                    <Button text="JournalEntry" id="info" style={{ marginRight: "1em" }} />
                    <Button text="Account" id="info" />
                </div>



                {/* <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Account</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                    </table>
                </div> */}

            </div>

        </div >
    )
}

export default Transactions;