import React, { useEffect, useState, useContext } from "react";
import { LuPenSquare } from "react-icons/lu";
import { RightsContext } from "../contexts/RightsProvider";
import FaceForm from "../components/ProfileForms/FaceFormComponent";
import { REACT_APP_BACKEND_URL } from "../config";

const FaceComponent = ({ id }) => {
  const [face, setFace] = useState({});
  const [register, setRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  const { rights } = useContext(RightsContext);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${REACT_APP_BACKEND_URL}/member/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFace(data);
          if (rights.perm.type && rights.member_id === id) {
            if (
              !data.occupation ||
              !data.proffession ||
              !data.residence_address
            ) {
              setRegister(true);
            }
          } else if (!rights.perm.type && rights.member_id === id) {
            if (!data.hall_of_attachment || !data.residence_address) {
              setRegister(true);
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const onCancel = () => {
    setRegister(false);
  };

  const onConfirm = (data) => {
    // console.log(data)
    const updatedData = async () => {
      try {
        const response = await fetch(`https://127.0.0.1:8000/member/${id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const res = await response.json();

        if (response.ok) {
          setFace(res);

          // console.log(data)
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setRegister(false);
      }
    };
    updatedData();
  };

  const openForm = () => {
    setRegister(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {register && (
        <FaceForm onCancel={onCancel} onConfirm={onConfirm} inData={face} />
      )}
      <div className="profile-item" id="first-item">
        {(rights.member_id == id || rights.perm.info_2 >= 2) && (
          <div className="edit-icon" onClick={openForm}>
            <LuPenSquare />
          </div>
        )}

        <div className="details">
          <h4>{`${face.sur_name} ${face.first_name} ${
            face.other_name ? face.other_name : ""
          }`}</h4>

          <h4>
            {face.residence_address
              ? face.residence_address
              : "Residence Address"}
          </h4>
          <h4>
            {face.phone_numbers?.length > 0
              ? face.phone_numbers.map((item) => item.number).join(", ")
              : "No Contacts Available"}
          </h4>
          {rights.perm.type ? (
            <h4>
              {face.proffession ? face.proffession : "Profession Missing"} |{" "}
              {face.occupation ? face.occupation : "Occupation Missing"}{" "}
            </h4>
          ) : (
            <h4>
              {face.hall_of_attachment
                ? face.hall_of_attachment
                : "Hall of Attachment"}{" "}
            </h4>
          )}

          <h4>
            {face.skills
              ? face.skills.split("#").join(" | ")
              : "No skills Found"}
          </h4>
        </div>
      </div>
    </>
  );
};

export default FaceComponent;
