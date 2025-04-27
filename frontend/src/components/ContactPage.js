import React from "react";
import { Container, Card } from "semantic-ui-react";

const ContactPage = () => {
  const teamMembers = [
    {
      name: "Manognya",
      email: "manognyaks@gmail.com",
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
