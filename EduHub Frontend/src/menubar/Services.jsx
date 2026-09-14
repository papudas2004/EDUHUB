import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Services.css"; 

const Services = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(null);

  const services = [
    {
      id: "online",
      title: "Online Learning",
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Access premium courses, live classes, recorded lectures, and study materials anytime.",
      extended: "Our learning suite features live high-fidelity video streams, interactive IDE integration for live browser sandbox compilation, structured track syllabi adjustments with historical lecture playbacks, and automated quiz score analytics."
    },
    {
      id: "placement",
      title: "Placement Assistance",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Get resume building support, mock interviews, aptitude training, and placement opportunities.",
      extended: "Coordinate directly with tier hiring partners. Includes automated ATS resume diagnostics, asynchronous mentor mock interview reviews with evaluation scoring matrices, and direct dashboard channel application pipelines."
    },
    {
      id: "library",
      title: "Digital Library",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Explore thousands of e-books, journals, research papers, and digital learning resources.",
      extended: "Instant entry into indexed repository assets containing peer-reviewed scientific journals, modern cloud-native systems textbooks, global research documentation indices, and institutional development archives."
    },
  ];

  return (
    <div className="classic-dark-wrapper min-vh-100 w-100 p-4">
      <div className="container-fluid max-layout-container">
        
        {/* Top Header Console Panel Section */}
        <header className="services-header text-center mb-5">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <span className="services-indicator-dot me-2"></span>
            <span className="services-section-badge">Platform Capabilities</span>
          </div>
          <h1 className="services-main-title text-white">Our Institutional Services</h1>
          <p className="services-subtitle mx-auto mt-2">
            Empowering students with production-ready technological infrastructure and validated career pathways.
          </p>
        </header>

        {/* Unified Service Cards Grid Structure */}
        <div className="row g-4 justify-content-center">
          {services.map((service, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div className="classic-service-card shadow-lg h-100 d-flex flex-column justify-content-between">
                
                {/* Media Image container */}
                <div className="service-image-frame position-relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="service-card-image"
                  />
                  <div className="image-overlay-vignette"></div>
                </div>

                {/* Content Panel Block details area */}
                <div className="service-card-body p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <h2 className="service-title text-white mb-2">{service.title}</h2>
                    <p className="service-description-text mb-4">{service.description}</p>
                  </div>

                  {/* Accessible Control Action Buttons */}
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-services-secondary flex-grow-1"
                      onClick={() => setActiveFeature(service)}
                    >
                      Learn More
                    </button>

                    <button 
                      className="btn btn-emerald-services flex-grow-1"
                      onClick={() => navigate("/register")}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Detail Modal Dialog Drawer Overlay */}
        {activeFeature && (
          <div className="services-modal-overlay d-flex justify-content-center align-items-center p-3" onClick={() => setActiveFeature(null)}>
            <div className="services-modal-card p-4 shadow-lg border border-dark-subtle" onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="badge bg-success mb-2">Service Diagnostic Blueprint</span>
                  <h4 className="text-white m-0">{activeFeature.title}</h4>
                </div>
                <button className="btn-close-services" onClick={() => setActiveFeature(null)}>✕</button>
              </div>
              <p className="services-extended-text py-2 m-0">{activeFeature.extended}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Services;
