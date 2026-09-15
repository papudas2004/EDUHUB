import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContactById } from "../api/api";
import "./ContactDetails.css"; 

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);

  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      const response = await getContactById(id);
      setContact(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to fetch contact details");
    }
  };

  if (!contact) {
    return (
      <div className="classic-dark-wrapper d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Gets the first letter of the name for a sleek circular avatar badge
  const avatarInitial = contact.name ? contact.name.charAt(0).toUpperCase() : "C";

  return (
    <div className="classic-dark-wrapper d-flex justify-content-center align-items-center min-vh-100 w-100"> 
      <div className="classic-profile-card shadow-lg p-5">
        
        {/* Header Profile Section */}
        <div className="text-center mb-4">
          <div className="avatar-circle mx-auto mb-3">
            {avatarInitial}
          </div>
          <h2 className="profile-title text-white m-0">{contact.name}</h2>
          <p className="profile-subtitle text-muted mt-1">{contact.email}</p>
          <span className="badge-verified">Institutional Contact</span>
        </div>

        <hr className="divider-line my-4" />

        {/* Details Information Rows */}
        <div className="info-section">
          <div className="info-row">
            <span className="info-label">System Account ID</span>
            <span className="info-value id-style">{contact._id}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Phone Number</span>
            <span className="info-value">{contact.phoneno || "—"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">City Location</span>
            <span className="info-value">{contact.city || "—"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Physical Address</span>
            <span className="info-value">{contact.address || "—"}</span>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="text-center mt-5">
          <button
            className="btn btn-classic-back px-5 py-2"
            onClick={() => navigate("/Contact-List")}
          >
            ← Back to List
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactDetails;
