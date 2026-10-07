import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { CONFIG } from "../config";
import "../styles/common.css";
import "../styles/components.css";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${CONFIG.backend_url}/programs/`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch programs");

        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Unable to load programs.");
        setErrorAlert(true);
      }
    };

    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;

    try {
      const response = await fetch(`${CONFIG.backend_url}/programs/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Delete failed");

      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to delete program.");
      setErrorAlert(true);
    }
  };

  return (
    <div className="container mt-4">

      {errorAlert && (
        <Alert
          type="Error"
          message={errorMessage}
          onCancel={() => setErrorAlert(false)}
        />
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Programs</h3>
          <small className="text-muted">
            Organising Committee Program Management
          </small>
        </div>

        <button
          className="btn btn-primary px-4 py-2 shadow-sm"
          onClick={() => navigate("/organisingCommittee/programs/new")}
        >
          + New Program
        </button>
      </div>

      {/* Summary Card */}
      <div className="card border-0 shadow-sm mb-4 rounded-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">Total Programs</h6>
            <h3 className="fw-bold">{programs.length}</h3>
          </div>

          <div
            style={{
              background: "#eef2ff",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "22px",
            }}
          >
            📋
          </div>
        </div>
      </div>

      {/* Programs Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th>Program</th>
                  <th>Period</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>

                {programs.length > 0 ? (
                  programs.map((program) => (
                    <tr key={program.id} className="program-row">

                      <td
                        className="fw-semibold text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/organisingCommittee/programs/${program.id}`)
                        }
                      >
                        {program.name}
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          {program.period_type}
                        </span>
                      </td>

                      <td>{program.location}</td>

                      <td className="text-muted">
                        {program.description
                          ? program.description.split(" ").slice(0, 12).join(" ") + "..."
                          : "No description"}
                      </td>

                      <td className="text-center">

                        <div className="d-flex justify-content-center gap-2">

                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            onClick={() =>
                              navigate(
                                `/organisingCommittee/programs/edit/${program.id}`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDelete(program.id)}
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No programs created yet
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;