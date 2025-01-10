import React, { useState } from "react";
import footerLogo from "../assets/Vector.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPinterest } from "react-icons/fa";

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <footer className="bg-light py-5">
      <div className="container">
        {/* For mobile screens */}
        <div className="d-block d-md-none">
          <div className="accordion">
            {[
              {
                title: "Categories",
                items: ["C++", "C", "Python", "C#", "Java"],
              },
              {
                title: "About",
                items: [
                  "Careers",
                  "Press & News",
                  "Partnerships",
                  "Privacy Policy",
                  "Terms of Service",
                  "Intellectual Property Claims",
                  "Investor Relations",
                ],
              },
              {
                title: "Support and Education",
                items: [
                  "Help & Support",
                  "Trust & Safety",
                  "Quality Guide",
                  "Fiverr Guides",
                  "Learn (Online Courses)",
                ],
              },
              {
                title: "Community",
                items: [
                  "Register as a Developer",
                  "Invite a Friend",
                  "Discussion Forum",
                ],
              },
              {
                title: "Business Solutions",
                items: ["About Business Solutions", "UnityStack Pro"],
              },
            ].map((section, index) => (
              <div key={index} className="mb-3">
                <h5
                  className="fw-bold d-flex justify-content-between align-items-center"
                  onClick={() => toggleAccordion(index)}
                  style={{ cursor: "pointer" }}
                >
                  {section.title}
                  <span>{activeIndex === index ? "▲" : "▼"}</span>
                </h5>
                {activeIndex === index && (
                  <ul className="list-unstyled mt-2">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* For desktop screens */}
        <div className="row d-none d-md-flex">
          <div className="col-6 col-md-2 mb-4">
            <h5 className="fw-bold">Categories</h5>
            <ul className="list-unstyled">
              <li>Student</li>
              <li>Develpor</li>
              <li>Organization</li>
             
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-4">
            <h5 className="fw-bold">About</h5>
            <ul className="list-unstyled">
              <li>Careers</li>
              <li>Press & News</li>
              <li>Partnerships</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
             
            </ul>
          </div>

          <div className="col-6 col-md-3 mb-4">
            <h5 className="fw-bold">Support and guidline</h5>
            <ul className="list-unstyled">
              <li>FAQ</li>
              <li>Trust & Safety</li>
              <li>Quality Guide</li>
              
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-4">
            <h5 className="fw-bold">Community</h5>
            <ul className="list-unstyled">
              <li>Register as a Developer</li>
             
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-4">
            <h5 className="fw-bold">About Solutions</h5>
            <ul className="list-unstyled">
              <li>Question forum</li>
              <li>UnityStack Session</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <hr />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <img
              src={footerLogo}
              alt="Logo"
              style={{ width: "40px", height: "auto" }}
              className="me-2"
            />
            <span className="text-muted">
               UnityStack International Ltd. 2024
            </span>
          </div>

          {/* Social Media Icons */}
          <div className="d-flex align-items-center gap-3">
            <FaFacebookF className="text-muted" style={{ cursor: "pointer" }} />
            <FaInstagram className="text-muted" style={{ cursor: "pointer" }} />
            <FaTwitter className="text-muted" style={{ cursor: "pointer" }} />
            <FaLinkedinIn className="text-muted" style={{ cursor: "pointer" }} />
            <FaPinterest className="text-muted" style={{ cursor: "pointer" }} />
          </div>

          {/* Language & Currency */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
            <span>English</span>
            <span>PKR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
