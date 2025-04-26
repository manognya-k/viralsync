import React from "react";
import { Container, Card } from "semantic-ui-react";

const ContactPage = () => {
  const teamMembers = [
    {
      name: "Teammate 1",
      email: "email1@example.com",
    },
    {
      name: "Teammate 2",
      email: "email2@example.com",
    },
    {
      name: "Teammate 3",
      email: "email3@example.com",
    },
  ];

  return (
    <Container style={{ marginTop: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Meet Our Team</h1>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap",
        marginTop: "2rem",
      }}>
        {teamMembers.map((member, index) => (
          <Card key={index} style={{ minWidth: "250px", padding: "1rem" }}>
            <Card.Content>
              <Card.Header>{member.name}</Card.Header>
              <Card.Description>{member.email}</Card.Description>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default ContactPage;
