import React from "react";
import james from "../assets/james.png";
import urien from "../assets/urien.jpg";
import kim from "../assets/kim.png";
import adcor from "../assets/adcor.jpg";

const About = () => {
  const groupMembers = [
    { name: "James Harold Roble", photo: james },
    { name: "Urien Adriane Suico", photo: urien },
    { name: "Kim Charles Emping", photo: kim },
    { name: "Adcor Ernest Yoj Luengas", photo: adcor },
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh", boxSizing: "border-box" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>About Our Group</h1>
      <h2 style={{ textAlign: "center", color: "#555", marginBottom: "40px" }}>Group Members</h2>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px" }}>
        {groupMembers.map((member, index) => (
          <div key={index} style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: "20px",
            width: "220px",
            textAlign: "center",
            transition: "transform 0.3s ease",
            cursor: "default"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <img
              src={member.photo}
              alt={member.name}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}
            />
            <p style={{ fontSize: "18px", fontWeight: "600", color: "#222", margin: 0 }}>{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
