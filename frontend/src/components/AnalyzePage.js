import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Dropdown, Divider, Icon } from "semantic-ui-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns"; // Import date-fns functions

const COLORS = ["#00C49F", "#FF8042", "#FFD700"]; // Colors for positive, negative, neutral

const sentimentOptions = [
  { key: "positive", text: "Positive", value: "Positive" },
  { key: "negative", text: "Negative", value: "Negative" },
  { key: "neutral", text: "Neutral", value: "Neutral" },
];

const getSentimentColor = (sentiment) => {
  sentiment = sentiment.toLowerCase();
  if (sentiment === "positive") return "green";
  if (sentiment === "negative") return "red";
  if (sentiment === "neutral") return "gold";
  return "black";
};

const AnalyzePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisData } = location.state || {};
  const [videoInfo, setVideoInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [showTop10, setShowTop10] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState("All");
  const [pieData, setPieData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    let data = analysisData;

    if (!data) {
      // Try fetching from localStorage
      const storedData = localStorage.getItem("analysisData");
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } else {
      // Save fresh data to localStorage
      localStorage.setItem("analysisData", JSON.stringify(analysisData));
    }

    if (!data) {
      toast.error("No analysis data found. Please analyze a video first.");
      navigate("/");
      return;
    }

    setVideoInfo(data.video_info);
    setComments(data.all_comments);
    setFilteredComments(data.top_comments);

    const sentiments = { Positive: 0, Negative: 0, Neutral: 0 };
    data.all_comments.forEach((comment) => {
      const sentiment = comment.sentiment.toLowerCase();
      if (sentiment === "positive") sentiments.Positive++;
      else if (sentiment === "negative") sentiments.Negative++;
      else if (sentiment === "neutral") sentiments.Neutral++;
    });

    const formattedData = [
      { name: "Positive", value: sentiments.Positive },
      { name: "Negative", value: sentiments.Negative },
      { name: "Neutral", value: sentiments.Neutral },
    ];
    setPieData(formattedData);

    toast.success("Comments Loaded Successfully!");
  }, [analysisData, navigate]);

  const handleToggle = () => {
    setShowTop10(!showTop10);
    setSelectedSentiment("All");

    if (showTop10) {
      setFilteredComments(comments);
    } else {
      const storedData = JSON.parse(localStorage.getItem("analysisData"));
      if (storedData) {
        setFilteredComments(storedData.top_comments);
      }
    }
  };

  const handleFilterChange = (e, { value }) => {
    setSelectedSentiment(value);

    let source = showTop10 ? JSON.parse(localStorage.getItem("analysisData")).top_comments : comments;

    if (value === "All") {
      setFilteredComments(source);
    } else {
      const filtered = source.filter((comment) =>
        comment.sentiment.toLowerCase() === value.toLowerCase()
      );
      setFilteredComments(filtered);
    }
  };

  const handlePieChartClick = () => {
    setShowChart(!showChart);
  };

  if (!videoInfo) {
    return <div>Loading video details...</div>;
  }

  // Format published date and calculate time ago
  const publishedDate = new Date(videoInfo.published_time);
  const formattedDate = format(publishedDate, "MMMM dd, yyyy");
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <Container style={{ marginTop: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Analysis Results</h1>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "teal" }}>
        {videoInfo.title}
      </h2>

      {/* Video Metadata */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        {/* Boxes for Likes, Views, etc. (unchanged) */}
        
        {/* Likes */}
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            flex: "1",
            minWidth: "150px",
            background: "#f0f0f0",
            padding: "1rem",
            margin: "0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Icon name="thumbs up" size="large" color="blue" />
          <h4>Likes</h4>
          <p>{videoInfo.likes}</p>
        </motion.div>

        {/* Views */}
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            flex: "1",
            minWidth: "150px",
            background: "#f0f0f0",
            padding: "1rem",
            margin: "0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Icon name="eye" size="large" color="green" />
          <h4>Views</h4>
          <p>{videoInfo.views}</p>
        </motion.div>

        {/* Channel */}
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            flex: "1",
            minWidth: "150px",
            background: "#f0f0f0",
            padding: "1rem",
            margin: "0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Icon name="user" size="large" color="purple" />
          <h4>Channel</h4>
          <p>{videoInfo.channel_name}</p>
        </motion.div>

        {/* Subscribers */}
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            flex: "1",
            minWidth: "150px",
            background: "#f0f0f0",
            padding: "1rem",
            margin: "0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Icon name="users" size="large" color="orange" />
          <h4>Subscribers</h4>
          <p>{videoInfo.subscriber_count}</p>
        </motion.div>

        {/* Published */}
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            flex: "1",
            minWidth: "150px",
            background: "#f0f0f0",
            padding: "1rem",
            margin: "0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Icon name="calendar" size="large" color="blue" />
          <h4>Published</h4>
          <p>{formattedDate} ({timeAgo})</p>
        </motion.div>
      </div>

      {/* Rest of your AnalyzePage remains unchanged */}
      {/* Description button, Comments section, Pie Chart, etc. (as you already wrote) */}


      {/* Description Button (Left aligned) */}
      <Button 
        size="small" 
        color="teal" 
        onClick={() => setShowDescription(!showDescription)}
        style={{ marginBottom: "1rem" }}
      >
        {showDescription ? "Hide Description" : "Show Description"}
      </Button>

      {/* Show Description Text */}
      {showDescription && (
        <p style={{ marginTop: "1rem" }}>{videoInfo.description}</p>
      )}

      <Divider />

      {/* Buttons Row */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "1rem" }}>
        <Button toggle active={!showTop10} onClick={handleToggle} color="teal">
          {showTop10 ? "Show All Comments" : "Show Top 10 Comments"}
        </Button>

        <Dropdown
          selection
          icon={<Icon name="filter" />}
          options={[{ key: "all", text: "All", value: "All" }, ...sentimentOptions]}
          onChange={handleFilterChange}
          value={selectedSentiment}
          placeholder="Filter by Sentiment"
          style={{ marginLeft: "1rem" }}
        />
      </div>

      {/* Comments Container */}
      <div style={{
        maxHeight: "400px",
        overflowY: "auto",
        background: "#fafafa",
        padding: "1rem",
        borderRadius: "10px",
      }}>
        {filteredComments.length === 0 ? (
          <p>No comments available.</p>
        ) : (
          filteredComments.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                background: "#f1f1f1",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, marginRight: "1rem" }}>
                {item.comment}
              </div>
              <span style={{
                color: getSentimentColor(item.sentiment),
                fontWeight: "bold",
              }}>
                {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase()}
              </span>
            </motion.div>
          ))
        )}
      </div>

      <Divider />

      {/* Pie Chart Button */}
<div style={{ textAlign: "center", marginTop: "2rem" }}>
  <Button color="teal" onClick={handlePieChartClick}>
    {showChart ? "Hide Pie Chart" : "Generate Pie Chart"}
  </Button>
</div>

{/* Pie Chart Animation */}
{showChart && (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "2rem",
    }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 10 }}
    >
      <PieChart width={400} height={400}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          label
          isAnimationActive={true} // <- add this for initial pie animation
          animationBegin={0}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {pieData.map((entry, index) => {
            let color;
            if (entry.name === "Positive") {
              color = "#00C49F"; // Green
            } else if (entry.name === "Negative") {
              color = "#FF8042"; // Red
            } else if (entry.name === "Neutral") {
              color = "#FFD700"; // Yellow
            } else {
              color = COLORS[index % COLORS.length]; // fallback
            }
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </motion.div>
  </motion.div>
)}

    </Container>
  );
};

export default AnalyzePage;
