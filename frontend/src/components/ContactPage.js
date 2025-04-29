import React from "react";
import { Container, Card } from "semantic-ui-react";

const ContactPage = () => {
  const teamMembers = [
    {
      name: "Manognya",
      email: "manognyaks2435@gmail.com",
    },
    {
      name: "Vardhana",
      email: "vardhanahemsham22@gmail.com",
    },
    {
      name: "Manasvi",
      email: "berimanasvi@gmail.com",
    },
  ];

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "2rem 0" }}>
      <Container>
        <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#333" }}>
          Meet Our Team
        </h1>
        <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#666", marginBottom: "3rem" }}>
          We're here to help you. Feel free to reach out to us!
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              style={{
                minWidth: "260px",
                padding: "1.5rem",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                borderRadius: "12px",
                background: "white",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <Card.Content>
                <Card.Header style={{ marginBottom: "0.5rem", color: "#2c3e50", fontSize: "1.4rem" }}>
                  {member.name}
                </Card.Header>
                <Card.Description style={{ color: "#555", fontSize: "1rem" }}>
                  <a href={`mailto:${member.email}`} style={{ color: "#4183c4", textDecoration: "none" }}>
                    {member.email}
                  </a>
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
