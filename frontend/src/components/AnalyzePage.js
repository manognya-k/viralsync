import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Dropdown, Divider, Icon } from "semantic-ui-react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";

// Active slice rendering
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

const COLORS = ["#00C49F", "#FF8042", "#FFD700"];

const sentimentOptions = [
  { key: "positive", text: "Positive", value: "Positive" },
  { key: "negative", text: "Negative", value: "Negative" },
  { key: "neutral", text: "Neutral", value: "Neutral" },
];

const getSentimentColor = (sentiment) => {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "green";
    case "negative":
      return "red";
    case "neutral":
      return "gold";
    default:
      return "black";
  }
};

const AnalyzePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisData } = location.state || {};

  const [videoInfo, setVideoInfo] = useState(null);
  const [filteredComments, setFilteredComments] = useState([]); // Removed 'comments' state as it's not needed
  const [showTop10, setShowTop10] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState("All");
  const [pieData, setPieData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let data = analysisData;
    if (!data) {
      const storedData = localStorage.getItem("analysisData");
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } else {
      localStorage.setItem("analysisData", JSON.stringify(analysisData));
    }

    if (!data) {
      toast.error("No analysis data found. Please analyze a video first.");
      navigate("/");
      return;
    }

    setVideoInfo(data.video_info);

    // Set the filtered comments from top comments initially
    setFilteredComments(data.top_comments);

    // Calculate sentiment distribution
    const sentiments = { Positive: 0, Negative: 0, Neutral: 0 };
    data.all_comments.forEach((comment) => {
      const sentiment = comment.sentiment.toLowerCase();
      if (sentiment === "positive") sentiments.Positive++;
      else if (sentiment === "negative") sentiments.Negative++;
      else if (sentiment === "neutral") sentiments.Neutral++;
    });

    setPieData([
      { name: "Positive", value: sentiments.Positive },
      { name: "Negative", value: sentiments.Negative },
      { name: "Neutral", value: sentiments.Neutral },
    ]);

    toast.success("Comments Loaded Successfully!");
  }, [analysisData, navigate]);

  const handleToggle = () => {
    setShowTop10((prev) => !prev);
    setSelectedSentiment("All");
    const storedData = JSON.parse(localStorage.getItem("analysisData"));
    if (!storedData) return;
    setFilteredComments(showTop10 ? storedData.all_comments : storedData.top_comments);
  };

  const handleFilterChange = (e, { value }) => {
    setSelectedSentiment(value);
    const storedData = JSON.parse(localStorage.getItem("analysisData"));
    const source = showTop10 ? storedData.top_comments : storedData.all_comments;

    if (value === "All") {
      setFilteredComments(source);
    } else {
      const filtered = source.filter(
        (comment) => comment.sentiment.toLowerCase() === value.toLowerCase()
      );
      setFilteredComments(filtered);
    }
  };

  const handlePieChartClick = () => {
    setShowChart((prev) => !prev);
  };

  const publishedDate = videoInfo ? new Date(videoInfo.published_time) : null;
  const formattedDate = publishedDate ? format(publishedDate, "MMMM dd, yyyy") : "";
  const timeAgo = publishedDate ? formatDistanceToNow(publishedDate, { addSuffix: true }) : "";

  if (!videoInfo) {
    return <div>Loading video details...</div>;
  }

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
        marginBottom: "2rem",
      }}>
        {[{ icon: "thumbs up", color: "blue", label: "Likes", value: videoInfo.likes },
        { icon: "eye", color: "green", label: "Views", value: videoInfo.views },
        { icon: "user", color: "purple", label: "Channel", value: videoInfo.channel_name },
        { icon: "users", color: "orange", label: "Subscribers", value: videoInfo.subscriber_count },
        { icon: "calendar", color: "blue", label: "Published", value: `${formattedDate} (${timeAgo})` },
        ].map((item, index) => (
          <motion.div
            key={index}
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
            <Icon name={item.icon} size="large" color={item.color} />
            <h4>{item.label}</h4>
            <p>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Description Toggle */}
      <Button
        size="small"
        color="teal"
        onClick={() => setShowDescription((prev) => !prev)}
        style={{ marginBottom: "1rem" }}
      >
        {showDescription ? "Hide Description" : "Show Description"}
      </Button>

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

      {/* Pie Chart */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button color="teal" onClick={handlePieChartClick}>
          {showChart ? "Hide Pie Chart" : "Generate Pie Chart"}
        </Button>
      </div>

      {showChart && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
        >
          <PieChart width={400} height={400}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              label
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              isAnimationActive
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </motion.div>
      )}
    </Container>
  );
};

export default AnalyzePage;
