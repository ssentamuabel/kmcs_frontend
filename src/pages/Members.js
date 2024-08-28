
import React, {useState, useEffect, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import Table from '../components/TableComponent'
import Alert from '../components/Alert'
import '../styles/common.css'
import { FaBedPulse } from 'react-icons/fa6'
import Profile from './Profile'



const Members = ()=>{
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')
    const [tableData, setTableData] = useState([])
    const [profile, setProfile] = useState(false)
    const [userid, setUserid] = useState('')

    const {rights} = useContext(RightsContext)

    
    const student_columns = [
        {id: 1, name:"No"},
        {id:2,  name: "Name"},
        {id:3, name:"Gender"},
        {id:4, name:"Course" },
        {id:6, name: "Residence"},
        {id:5,  name:"Hall "},       
        {id:7, name: "Email"}
    ]

    const alumnus_columns = [
        {id: 1, name:"No"},
        {id:2,  name: "Name"},
        {id:3, name:"Gender"},
        {id:6, name: "Residence"},
        {id:4, name:"Occupation" },
        {id:5,  name:"Proffession "},        
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


        if (rights.perm.name  == 'student' || rights.perm.name  == 'alumnus'){

            setProfile(true)
            setUserid(rights.member_id)

        }else{

            const getData = async() =>{

                try {
                    const response = await fetch('https://127.0.0.1:8000/member/level_1/', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
    
                    if (response.ok){
                        const jsondata = await response.json()
    
                        setTableData(jsondata)
                        console.log(jsondata)
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
        }

        
            

    }, [])

    const seeProfile = (id)=>{
        setUserid(id)
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
                    user={userid}
                />
             ) : (
                 <Table 
                    columns = {rights.perm.type ? alumnus_columns : student_columns}
                    filter_data = {filter_data}
                    table_data = {tableData}
                    memberClick={seeProfile}
 
                />
             )} 
          
        </div>
    )
}


export default Members