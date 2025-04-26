import React, { useState } from "react";
import { Button, Input, Container, Dimmer, Loader, Segment } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./HomePage.css"; // Import the CSS file here

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
        Your browser does not support the video tag.
      </video>

      <Dimmer active={loading} inverted>
        <Loader size="large">Analyzing Comments...</Loader>
      </Dimmer>

      <Container textAlign="center" style={{ position: "relative", zIndex: 1, marginTop: "5rem" }}>
        {/* Title */}
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
    </Segment>
  );
};

export default HomePage;
