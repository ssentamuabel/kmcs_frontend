import React, { useState, useEffect, useContext } from 'react';
import { RightsContext } from '../contexts/RightsProvider';
import Table from '../components/TableComponent';
import Alert from '../components/Alert';
import Profile from './Profile';
import { CONFIG } from '../config';
import '../styles/common.css';
import '../styles/components.css';
import { FaUsers } from 'react-icons/fa6';

const Members = () => {
  const [errorAlert, setErrorAlert] = useState(false);
  const [error, setError] = useState('');
  const [tableData, setTableData] = useState([]);
  const [profile, setProfile] = useState(false);
  const [userid, setUserid] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { rights } = useContext(RightsContext);

  const student_columns = [
    { id: 1, name: 'No' },
    { id: 2, name: 'Name' },
    { id: 3, name: 'Gender' },
    { id: 4, name: 'Course' },
    { id: 6, name: 'Residence' },
    { id: 5, name: 'Hall' },
    { id: 7, name: 'Email' },
  ];

  const alumnus_columns = [
    { id: 1, name: 'No' },
    { id: 2, name: 'Name' },
    { id: 3, name: 'Gender' },
    { id: 6, name: 'Residence' },
    { id: 4, name: 'Occupation' },
    { id: 5, name: 'Profession' },
    { id: 7, name: 'Email' },
  ];

  useEffect(() => {
    let isFetching = false;

    const fetchData = async () => {
      if (isFetching || !hasMore) return;
      isFetching = true;

      try {
        const response = await fetch(
          `${CONFIG.backend_url}/member/level_1/?page=${currentPage}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const jsondata = await response.json();
          setTableData((prev) => [...prev, ...jsondata.results]);
          setHasMore(!!jsondata.next);
          setCurrentPage((prev) => prev + 1);
        } else {
          setError('Something went wrong');
          setErrorAlert(true);
        }
      } catch (error) {
        setError('Connection Problem');
        setErrorAlert(true);
      } finally {
        isFetching = false;
      }
    };

    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [currentPage, hasMore]);

  const seeProfile = (id) => {
    if (rights.perm.info_2 > 0) {
      setUserid(id);
      setProfile(true);
    }
  };

  const handleReturn = () => {
    setProfile(false);
  };

  return (
    <div className="members-page">
      {errorAlert && (
        <Alert type="Error" message={error} onCancel={() => setErrorAlert(false)} />
      )}

      <div className="members-header">
        <FaUsers className="members-icon" />
        <div className="members-header-text">
          <h2>{rights.perm.type ? 'Alumni Members' : 'Active Students'}</h2>
          <p className="subtitle">
            Browse through registered members and view detailed profiles
          </p>
        </div>
      </div>

      <div className="members-content">
        {profile ? (
          <Profile onReturn={handleReturn} user={userid} />
        ) : (
          <div className="table-card">
            <Table
              columns={rights.perm.type === 1 ? alumnus_columns : student_columns}
              student_columns={student_columns}
              alumnus_columns={alumnus_columns}
              table_data={tableData}
              memberClick={seeProfile}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
