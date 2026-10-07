import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import { CONFIG } from '../config';
import '../styles/common.css';
import '../styles/components.css';

const ProgramForm = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    period_type: '',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing program for edit
  useEffect(() => {
    if (id) {
      fetch(`${CONFIG.backend_url}/programs/${id}/`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch program');
          return res.json();
        })
        .then(data => setFormData({
          name: data.name,
          description: data.description,
          period_type: data.period_type,
          location: data.location
        }))
        .catch(err => {
          console.error(err);
          setErrorMessage('Unable to load program details');
          setErrorAlert(true);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${CONFIG.backend_url}/programs/${id}/` : `${CONFIG.backend_url}/programs/`;

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 400) {
        const data = await response.json();
        setErrors(data);
        return;
      }

      if (!response.ok) throw new Error('Failed to save program');
      navigate('/programs'); // Go back to program list
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred while saving the program.');
      setErrorAlert(true);
    }
  };

  return (
    <div className="container mt-4">
      {errorAlert && <Alert type="Error" message={errorMessage} onCancel={() => setErrorAlert(false)} />}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">{id ? 'Edit Program' : 'Create Program'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} id="program-form">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Program Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    required
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows="4"
                  />
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="period_type" className="form-label">Period Type</label>
                  <input
                    type="text"
                    id="period_type"
                    name="period_type"
                    value={formData.period_type}
                    onChange={handleChange}
                    className={`form-control ${errors.period_type ? 'is-invalid' : ''}`}
                  />
                  {errors.period_type && <div className="invalid-feedback">{errors.period_type}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                  />
                  {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button type="submit" className="btn btn-primary me-md-2">
                    Save Program
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/programs')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramForm;
