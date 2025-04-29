from flask import Flask, request, jsonify
from flask_cors import CORS
from fetch_comments import fetch_and_store_comments
from predictions import predict_sentiment
from database import update_comment_sentiment, fetch_top_comments
import sqlite3
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "AIzaSyBd8jlB-okHbUVVkr3zugO17KmNb2QO__o"

# Fetch YouTube video metadata
def fetch_video_metadata(video_id, api_key):
    video_url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={video_id}&key={api_key}"
    channel_url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id={{channel_id}}&key={api_key}"

    try:
        video_response = requests.get(video_url)
        video_response.raise_for_status()
        video_data = video_response.json()

        # Debugging: Check video_data structure
        print(f"Video Data: {video_data}")

        if not video_data["items"]:
            return None

        snippet = video_data["items"][0]["snippet"]
        stats = video_data["items"][0]["statistics"]
        channel_id = snippet.get("channelId")

        channel_response = requests.get(channel_url.format(channel_id=channel_id))
        channel_response.raise_for_status()
        channel_data = channel_response.json()

        # Debugging: Check channel_data structure
        print(f"Channel Data: {channel_data}")

        channel_snippet = channel_data["items"][0]["snippet"]
        channel_stats = channel_data["items"][0]["statistics"]

        return {
            "title": snippet.get("title", "No Title"),
            "description": snippet.get("description", ""),
            "views": stats.get("viewCount", "0"),
            "likes": stats.get("likeCount", "0"),
            "channel_name": snippet.get("channelTitle", "Unknown Channel"),
            "channel_verified": channel_snippet.get("country") is not None,
            "subscriber_count": channel_stats.get("subscriberCount", "0"),
            "published_time": snippet.get("publishedAt", "Unknown")  # Ensure publishedAt is fetched correctly
        }

    except Exception as e:
        print(f"Failed to fetch metadata: {e}")
        return {
            "title": "Unavailable",
            "description": "Could not fetch description.",
            "views": "N/A",
            "likes": "N/A",
            "channel_name": "Unavailable",
            "channel_verified": False,
            "subscriber_count": "N/A",
            "published_time": "N/A"
        }

# New helper function to get all comments
def fetch_all_comments(video_id):
    conn = sqlite3.connect("comments.db")
    c = conn.cursor()
    c.execute("SELECT comment, sentiment FROM comments WHERE video_id = ?", (video_id,))
    rows = c.fetchall()
    conn.close()
    return [{"comment": comment, "sentiment": sentiment} for comment, sentiment in rows]

@app.route("/")
def home():
    return "Welcome to the YouTube Comment Sentiment Analysis API!"

@app.route("/analyze", methods=["POST"])
def analyze():
    print("🔧 /analyze route hit")
    data = request.get_json()
    video_url = data.get("video_url")

    if not video_url:
        return jsonify({"error": "No YouTube URL provided"}), 400

    try:
        video_id = fetch_and_store_comments(video_url, API_KEY)
        if not video_id:
            return jsonify({"error": "Could not extract video ID or fetch comments."}), 400

        conn = sqlite3.connect("comments.db")
        c = conn.cursor()
        c.execute("SELECT comment, user_id FROM comments WHERE flag = 0 AND video_id = ?", (video_id,))
        rows = c.fetchall()
        conn.close()

        for comment, user_id in rows:
            sentiment = predict_sentiment(comment)
            update_comment_sentiment(video_id, user_id, sentiment)

        top_comments = fetch_top_comments(video_id)
        all_comments = fetch_all_comments(video_id)
        video_info = fetch_video_metadata(video_id, API_KEY)

        # Debugging: Check if video_info contains the correct metadata
        print(f"Video Info: {video_info}")

        response_data = {
            "video_id": video_id,
            "video_info": video_info,
            "top_comments": [{"comment": c, "sentiment": s} for c, s in top_comments],
            "all_comments": all_comments  # <-- New field
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error in /analyze: {e}")
        return jsonify({"error": "An unexpected error occurred on the server."}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

