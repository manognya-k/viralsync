import React from "react";
import { Container, Header, Button } from "semantic-ui-react";

const InfoPage = () => {
  return (
    <Container style={{ marginTop: "2rem" }}>
      <Header as="h1" textAlign="center">Project Information</Header>

      <Header as="h2">Problem Statement</Header>
      <p>
        (Write your problem statement here...)  
        — Example: "Finding the sentiments of YouTube comments to understand user engagement and feedback."
      </p>

      <Header as="h2">Proposed Solution</Header>
      <p>Below is the solution diagram: (will add diagram here later)</p>
      <Button color="blue" style={{ marginBottom: "2rem" }}>
        View GitHub Repo
      </Button>
    </Container>
  );
};

export default InfoPage;
