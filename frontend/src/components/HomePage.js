import React, { useState } from "react";
import { Button, Input, Container, Dimmer, Loader, Segment, Header } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      toast.error("Please enter a valid YouTube URL!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/analyze", {
        video_url: videoUrl,
      });
      setLoading(false);
      toast.success("Analysis Completed!");
      navigate("/analyze", { state: { analysisData: response.data } });
    } catch (error) {
      setLoading(false);
      toast.error("Error analyzing video. Try again!");
    }
  };

  return (
    <Segment style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="/video2.mp4" type="video/mp4" />
      </video>

      <Dimmer active={loading} inverted>
        <Loader size="large">Analyzing Comments...</Loader>
      </Dimmer>

      <Container textAlign="center" style={{ position: "relative", zIndex: 1, marginTop: "5rem" }}>
        <h1 className="page-title">
          <i className="youtube icon red"></i> YouTube Comment Sentiment Analyzer
        </h1>

        <Input
          fluid
          size="large"
          placeholder="Enter YouTube Video URL..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ marginBottom: "1rem" }}
          className="input-field"
        />

        <Button primary onClick={handleAnalyze} className="analyze-button">
          Analyze
        </Button>
      </Container>

      {/* Problem Statement Segment */}
      <>
  {/* Scrollable Problem Statement Container */}
  <Segment
    padded
    raised
    style={{
      maxHeight: "400px",
      overflowY: "auto",
      width: "90%",
      maxWidth: "1000px",
      margin: "3rem auto",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      zIndex: 1,
      position: "relative",
    }}
  >
    <Header as="h2" color="blue" textAlign="center">Problem Statement</Header>
    <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
      The goal of this project is to overcome the drawbacks of manual analysis and conventional sentiment tools 
      by automating the analysis of YouTube comments in order to comprehend user sentiment. Large comment volumes, 
      a variety of languages (including code-mixed and informal language), and the difficulty for content creators 
      to access and visualize this data are some of the issues it addresses.
    </p>
    <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
      The suggested system gathers comments via the YouTube API and stores them in a database for convenient access. 
      A hybrid 1D CNN and LSTM model is used for sentiment analysis, and it is capable of recognizing local patterns 
      and comprehending contextual sentiment, even in informal and code-mixed language.
    </p>
    <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
      This project does not rely on pre-trained word embeddings; instead, it learns directly from processed comments. 
      The results are shown as a pie chart that allows content creators to monitor sentiment and improve engagement.
    </p>
  </Segment>

  {/* Architecture Diagram Outside Scrollable Container */}
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <Header as="h3" color="teal">Architecture Diagram</Header>
    <img
      src="/architecture.jpg"
      alt="Architecture Diagram"
      style={{ maxWidth: "90%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
    />
  </div>
</>


    </Segment>
  );
};

export default HomePage;
