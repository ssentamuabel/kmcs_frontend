
import React, {useState, useEffect} from 'react'
import Table from '../components/TableComponent'
import Alert from '../components/Alert'
import '../styles/common.css'
import { FaBedPulse } from 'react-icons/fa6'
import Profile from './Profile'



const Members = ()=>{
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')
    const [tableData, setTableData] = useState([])
    const [profile, setProfile] = useState(true)

    
    const member_columns = [
        {id: 1, name:"No"},
        {id:2,  name: "Name"},
        {id:3, name:"Gender"},
        {id:4, name:"Course" },
        {id:5,  name:"Hall "},
        {id:6, name: "Phone"},
        {id:7, name: "Email"}
    ]

    const filter_data = [
        {
            name : "Entry",
            options: [
                {value: '1', name: '10'},
                {value: '2', name: '11'},
                {value: '3', name: '12'}
            ],
            label: 'Filter Entry'
        },
        {
            name : "Hall",
            options: [
                {value: '1', name: 'Kulubya'},
                {value: '2', name: 'Pearl'},
                {value: '3', name: 'Nanziri'},
                {value: '4', name: 'North Hall'}
            ],
            label: 'Filter Hall'
        }
    ]
   

    useEffect(()=>{

        const getData = async() =>{

            try {
                const response = await fetch('http://127.0.0.1:8000/member/level_1/', {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                

                if (response.ok){
                    const jsondata = await response.json()

                    setTableData(jsondata)
                    // console.log(jsondata)
                }else{
                    setError(`Something went wrong`)
                    setErrorAlert(true)
                }

            } catch (error) {
                setError('Connection Problem')
                setErrorAlert(true)
            }
        }

        getData()
            

    }, [])

    const seeProfile = ()=>{
        setProfile(true)
    }
    const handleReturn = () =>{
        setProfile(false)
    }

    return (
        <div className="page-container">
              { 
                errorAlert && (<Alert 
                type='Error'
                message ={error}
                 onCancel={()=>{setErrorAlert(false)}}                     
                />)
             }
             {profile ? (
                <Profile
                    onReturn ={handleReturn}
                />
             ) : (
                 <Table 
                    columns = {member_columns}
                    filter_data = {filter_data}
                    table_data = {tableData}
                    memberClick={seeProfile}
 
                />
             )} 
          
        </div>
    )
}


export default Members