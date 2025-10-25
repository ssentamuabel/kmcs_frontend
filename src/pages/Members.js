
import React, { useState, useEffect, useContext } from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import Table from '../components/TableComponent'
import Alert from '../components/Alert'
import '../styles/common.css'
import { FaBedPulse } from 'react-icons/fa6'
import Profile from './Profile'
import { CONFIG } from '../config'




const Members = () => {
	const [errorAlert, setErrorAlert] = useState(false)
	const [error, setError] = useState('')
	const [tableData, setTableData] = useState([])
	const [profile, setProfile] = useState(false)
	const [userid, setUserid] = useState('')
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const { rights } = useContext(RightsContext)


	const student_columns = [
		{ id: 1, name: "No" },
		{ id: 2, name: "Name" },
		{ id: 3, name: "Gender" },
		{ id: 4, name: "Course" },
		{ id: 6, name: "Residence" },
		{ id: 5, name: "Hall " },
		{ id: 7, name: "Email" }
	]

	const alumnus_columns = [
		{ id: 1, name: "No" },
		{ id: 2, name: "Name" },
		{ id: 3, name: "Gender" },
		{ id: 6, name: "Residence" },
		{ id: 4, name: "Occupation" },
		{ id: 5, name: "Profession " },
		{ id: 7, name: "Email" }
	]

	useEffect(() => {
		let isFetching = false;

		const fetchData = async () => {
			if (isFetching || !hasMore) return; // Skip if already fetching or no more data
			isFetching = true;

			try {
				const response = await fetch(`${CONFIG.backend_url}/member/level_1/?page=${currentPage}`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (response.ok) {
					const jsondata = await response.json();

					// Append new data to existing data for infinite scroll
					setTableData((prevData) => [...prevData, ...jsondata.results]);
					setHasMore(!!jsondata.next);  // Check if there's more data to load
					setCurrentPage((prevPage) => prevPage + 1);  // Move to next page
				} else {
					setError(`Something went wrong`);
					setErrorAlert(true);
				}
			} catch (error) {
				setError('Connection Problem');
				setErrorAlert(true);
			} finally {
				isFetching = false;
			}
		};

		const intervalId = setInterval(() => {
			fetchData();
		}, 3000);

		return () => clearInterval(intervalId); // Clear the interval on unmount
	}, [currentPage, hasMore]);


	const seeProfile = (id) => {

		if (rights.perm.info_2 > 0) {
			setUserid(id)
			setProfile(true)
		}

	}
	const handleReturn = () => {
		setProfile(false)
	}

	return (
		<>
			{
				errorAlert && (<Alert
					type='Error'
					message={error}
					onCancel={() => { setErrorAlert(false) }}
				/>)
			}
			{profile ? (
				<Profile
					onReturn={handleReturn}
					user={userid}
				/>
			) : (
				<Table
					columns={rights.perm.type ? alumnus_columns : student_columns}
					table_data={tableData}
					memberClick={seeProfile}

				/>
			)}

		</>
	)
}


export default Members