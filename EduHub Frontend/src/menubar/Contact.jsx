import React, { useState } from "react";
import { createContact } from "../api/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.css"; // Links your classic custom theme styles smoothly

const Contact = () => {
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phoneno: "",
    password: "",
    city: "",
    address: "",
  });

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createContact(contact);

      alert(response.data.message || "Contact Saved Successfully");

      setContact({
        name: "",
        email: "",
        phoneno: "",
        password: "",
        city: "",
        address: "",
      });

      navigate("/contact-list");
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="classic-dark-wrapper min-vh-100 w-100 d-flex justify-content-center align-items-center p-4">
      <div className="classic-form-card shadow-lg p-5">
        
        {/* Header Title Section */}
        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <span className="form-indicator-dot me-2"></span>
            <h2 className="form-main-title text-white m-0">Add New Employee</h2>
          </div>
          <p className="form-subtitle text-muted m-0">Fill in the institutional profile details below</p>
        </div>

        <hr className="form-divider-line mb-4" />

        <form onSubmit={handleSubmit}>
          
          <div className="row">
            {/* Name Field */}
            <div className="col-md-6 mb-3">
              <label className="classic-form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control classic-dark-input"
                placeholder="e.g. Virat Kohli"
                value={contact.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field */}
            <div className="col-md-6 mb-3">
              <label className="classic-form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control classic-dark-input"
                placeholder="name@gmail.com"
                value={contact.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            {/* Phone Field */}
            <div className="col-md-6 mb-3">
              <label className="classic-form-label">Phone Number</label>
              <input
                type="text"
                name="phoneno"
                className="form-control classic-dark-input"
                placeholder="Enter 10-digit number"
                value={contact.phoneno}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="col-md-6 mb-3">
              <label className="classic-form-label">System Password</label>
              <input
                type="password"
                name="password"
                className="form-control classic-dark-input"
                placeholder="Assign secure credentials"
                value={contact.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* City Field */}
          <div className="mb-3">
            <label className="classic-form-label">City Location</label>
            <input
              type="text"
              name="city"
              className="form-control classic-dark-input"
              placeholder="Enter City"
              value={contact.city}
              onChange={handleChange}
            />
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <label className="classic-form-label">Physical Address</label>
            <textarea
              rows="3"
              name="address"
              className="form-control classic-dark-input"
              placeholder="Enter complete residential details..."
              value={contact.address}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Bottom Custom Form Action Control Buttons */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4">
            <button
              type="button"
              className="btn btn-classic-cancel px-4"
              onClick={() => navigate("/contact-list")}
            >
              Cancel
            </button>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-classic-reset px-4"
                onClick={() =>
                  setContact({
                    name: "",
                    email: "",
                    phoneno: "",
                    password: "",
                    city: "",
                    address: "",
                  })
                }
              >
                Reset
              </button>

              <button type="submit" className="btn btn-emerald-save px-4">
                Save Contact
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Contact;
