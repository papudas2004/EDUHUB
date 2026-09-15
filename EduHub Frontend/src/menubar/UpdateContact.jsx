import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContactById, updateContact } from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./contactList.css"; 

const UpdateContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phoneno: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const response = await getContactById(id);
      if (response && response.data) {
        setContact(response.data);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load contact data");
    }
  };

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContact(id, contact);
      alert("Contact Updated Successfully");
      navigate("/Contact-List");
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="classic-dark-wrapper min-vh-100 w-100 p-4" style={{ backgroundColor: "#0b1329" }}>
      <div className="container d-flex justify-content-center align-items-center pt-4">
        
        {/* Sleek, centered panel component styled exactly like your table canvas card */}
        <div className="classic-console-card shadow-lg p-5 rounded-3 w-100" style={{ maxWidth: "550px", backgroundColor: "#1c2541" }}>
          
          {/* Section Indicator */}
          <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
            <span className="status-indicator-dot me-2" style={{ width: "10px", height: "10px", backgroundColor: "#00c389", borderRadius: "50%", display: "inline-block" }}></span>
            <h3 className="section-panel-title text-white m-0 fs-4 fw-bold">Update Employee</h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Name Form Group */}
            <div className="mb-3">
              <label className="text-white fw-semibold small mb-2 d-block">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control text-white border-secondary px-3 py-2"
                style={{ backgroundColor: "#0b1329", outline: "none" }}
                value={contact.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Form Group */}
            <div className="mb-3">
              <label className="text-white fw-semibold small mb-2 d-block" style={{ color: "#00c389 !important" }}>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control text-white border-secondary px-3 py-2"
                style={{ backgroundColor: "#0b1329", outline: "none" }}
                value={contact.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Form Group */}
            <div className="mb-3">
              <label className="text-white fw-semibold small mb-2 d-block" style={{ color: "#a0aec0" }}>Phone Number</label>
              <input
                type="text"
                name="phoneno"
                className="form-control text-white border-secondary px-3 py-2"
                style={{ backgroundColor: "#0b1329", outline: "none" }}
                value={contact.phoneno}
                onChange={handleChange}
              />
            </div>

            {/* City Form Group */}
            <div className="mb-3">
              <label className="text-white fw-semibold small mb-2 d-block" style={{ color: "#a0aec0" }}>City</label>
              <input
                type="text"
                name="city"
                className="form-control text-white border-secondary px-3 py-2"
                style={{ backgroundColor: "#0b1329", outline: "none" }}
                value={contact.city}
                onChange={handleChange}
              />
            </div>

            {/* Address Form Group */}
            <div className="mb-4">
              <label className="text-white fw-semibold small mb-2 d-block" style={{ color: "#a0aec0" }}>Residential Address</label>
              <textarea
                name="address"
                className="form-control text-white border-secondary px-3 py-2"
                style={{ backgroundColor: "#0b1329", outline: "none", resize: "none" }}
                rows="3"
                value={contact.address}
                onChange={handleChange}
              />
            </div>

            {/* Bottom Action Footer Row Elements */}
            <div className="d-flex gap-2 pt-2 justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary px-4 py-2 text-white border-secondary"
                onClick={() => navigate("/Contact-List")}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-warning fw-bold text-dark px-4 py-2"
                style={{ backgroundColor: "#ffb703", borderColor: "#ffb703" }}
              >
                Save Updates
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UpdateContact;
