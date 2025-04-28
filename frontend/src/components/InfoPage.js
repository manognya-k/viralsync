import React from "react";
import { Container, Header, Button, Segment } from "semantic-ui-react";

const InfoPage = () => {
  return (
    <Container style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Header as="h1" textAlign="center" style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
        Project Information
      </Header>

      {/* Problem Statement */}
      <Segment padded raised>
        <Header as="h2" color="blue">Problem Statement</Header>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          The goal of this project is to overcome the drawbacks of manual analysis and conventional sentiment tools 
          by automating the analysis of YouTube comments in order to comprehend user sentiment. 
          Large comment volumes, a variety of languages (including code-mixed and informal language), 
          and the difficulty for content creators to access and visualize this data are some of the issues it addresses.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          The suggested system gathers comments via the YouTube API and stores them in a database for convenient access. 
          A hybrid 1D CNN and LSTM model is used for sentiment analysis, and it is capable of recognizing local patterns 
          and comprehending contextual sentiment, even in informal and code-mixed language. 
          In contrast to conventional techniques, this project does not rely on pre-trained word embeddings; 
          rather, it learns directly from the processed comments.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          The system evaluates views, likes, dislikes, and classifies comments as neutral, negative, or positive after users 
          enter the URL of a YouTube video. Because the findings are graphically displayed as a pie chart, 
          content producers can monitor sentiment, possibly enhance their work, and expand its audience. 
          More accurate sentiment analysis is provided by this method, particularly for code-mixed and other non-standard languages.
        </p>
      </Segment>

      {/* Space for Solution Diagram */}
      <Segment placeholder textAlign="center" style={{ margin: "3rem 0" }}>
        <Header as="h2" color="teal">Proposed Solution</Header>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          (Solution diagram will be added here...)
        </p>
      </Segment>

      {/* GitHub Repo Button */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          color="blue"
          size="large"
          href="https://github.com/manognya-k/viralsync.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          View GitHub Repo
        </Button>
      </div>
    </Container>
  );
};

export default InfoPage;
