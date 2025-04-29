import React from "react";
import { Container, Header, Button, Segment, Image } from "semantic-ui-react";

const InfoPage = () => {
  return (
    <Container style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Header as="h1" textAlign="center" style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
        Hybrid CNN + LSTM Model 
      </Header>

      {/* Scrollable Info Section */}
      <Segment
        padded
        raised
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          width: "90%",
          maxWidth: "1000px",
          margin: "0 auto 3rem",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Header as="h2" color="blue">Model Architecture</Header>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          The sentiment analysis model adapted in ViralSync is a hybrid CNN+LSTM deep learning architecture, developed
          to harness the strengths of both extraction of local features and sequential pattern recognition.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          The model starts with an Input Layer, which takes the tokenized sequences of YouTube comments as input. These
          sequences are numerical indices derived from the pre-defined vocabulary of words. The input is fed into an
          Embedding layer, where each token is projected into a 128-dimensional dense vector, forming an embedding
          matrix of dimensions (10000×128). This allows the model to capture semantic relationships between words.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          A Conv1D layer follows, applying 64 filters of size 5 across the embedded sequences to extract local features
          such as key phrases and emotional expressions. This is followed by a MaxPooling1D layer to reduce the spatial
          dimensions, enhance important features, and reduce overfitting.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          The output from the convolutional block is passed to an LSTM layer with 256 memory units, which captures
          sequential dependencies and context—especially useful for long sentences, sarcasm, and code-mixed content.
          A dropout layer is included afterward to reduce overfitting.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          The final Dense layers include one intermediate layer with 32 units and an output layer with 3 units using
          softmax activation to classify sentiments as positive, negative, or neutral. This hybrid approach allows
          ViralSync to handle noisy, informal, and code-mixed user-generated content effectively.
        </p>
      </Segment>

      {/* Architecture Diagram */}
      <Segment textAlign="center" style={{ margin: "3rem auto", width: "90%", maxWidth: "1000px" }} raised>
        <Header as="h2" color="teal">Model Architecture Diagram</Header>
        <Image
          src="/hybrid_model_diagram.png"
          alt="Hybrid CNN + LSTM Architecture"
          centered
          style={{ marginTop: "1rem", maxWidth: "100%", height: "auto" }}
        />
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
