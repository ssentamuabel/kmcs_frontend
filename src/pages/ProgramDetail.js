import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { CONFIG } from '../config';
import '../styles/common.css';
import '../styles/components.css';

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`${CONFIG.backend_url}/programs/${id}/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch program details');

        const data = await response.json();
        setProgram(data);
      } catch (err) {
        console.error(err);
        setErrorMessage('Unable to load program details.');
        setErrorAlert(true);
      }
    };

    fetchProgram();
  }, [id]);

  if (!program) return <p>Loading program details...</p>;

  return (
    <div className="container mt-4">
      {errorAlert && <Alert type="Error" message={errorMessage} onCancel={() => setErrorAlert(false)} />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Program Details: {program.name}</h3>
        <div>
          <button
            className="btn btn-sm btn-light me-2"
            onClick={() => navigate(`/organisingCommittee/programs/edit/${program.id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-light"
            onClick={() => navigate('/organisingCommittee/programs')}
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>Program Information</h5>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{program.name}</td>
              </tr>
              <tr>
                <th>Period Type:</th>
                <td>{program.period_type}</td>
              </tr>
              <tr>
                <th>Location:</th>
                <td>{program.location}</td>
              </tr>
              <tr>
                <th>Description:</th>
                <td>{program.description || <span className="text-muted">No description provided</span>}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card-footer text-muted">
          <small>
            Created: {new Date(program.created_at).toLocaleDateString()} | Last Updated: {new Date(program.updated_at).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
