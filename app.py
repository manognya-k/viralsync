# from flask import Flask, request, jsonify, send_file
# from fetch_comments import fetch_and_store_comments
# from pie_chart import generate_pie_chart
# from predictions import predict_sentiment
# from database import update_comment_sentiment, fetch_top_comments
# import os

# app = Flask(__name__)

# @app.route('/')
# def home():
#     return "Welcome to the YouTube Comment Sentiment Analysis API!"

# @app.route('/fetch_comments', methods=['POST'])
# def fetch_comments():
#     data = request.get_json()
#     video_url = data.get('video_url')
#     api_key = data.get('api_key')

#     if not video_url or not api_key:
#         return jsonify({"error": "Please provide both video_url and api_key."}), 400

#     video_id = fetch_and_store_comments(video_url, api_key)
#     if not video_id:
#         return jsonify({"error": "Failed to fetch comments."}), 400

#     return jsonify({"message": "Comments fetched and stored.", "video_id": video_id})

# @app.route('/process_comments', methods=['POST'])
# def process_comments():
#     data = request.get_json()
#     video_id = data.get('video_id')
    
#     if not video_id:
#         return jsonify({"error": "Please provide video_id."}), 400

#     # Process the comments and predict sentiment
#     process_comments(video_id, batch_size=100)

#     return jsonify({"message": "Comments processed successfully."})

# @app.route('/top_comments/<video_id>', methods=['GET'])
# def top_comments(video_id):
#     top_comments = fetch_top_comments(video_id)
#     return jsonify({"top_comments": [{"comment": comment, "sentiment": sentiment} for comment, sentiment in top_comments]})

# # @app.route('/generate_pie_chart/<video_id>', methods=['GET'])
# # def generate_pie(video_id):
# #     generate_pie_chart(video_id)
# #     return send_file('sentiment_pie_chart.png', mimetype='image/png', as_attachment=True)

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
from fetch_comments import fetch_and_store_comments
# from pie_chart import generate_pie_chart
from predictions import predict_sentiment
from database import update_comment_sentiment, fetch_top_comments
import sqlite3
import os

app = Flask(__name__)
# CORS(app)  # Allow requests from React frontend
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
# CORS(app, origins=["http://localhost:3000"])

CORS(app)

API_KEY = "AIzaSyBd8jlB-okHbUVVkr3zugO17KmNb2QO__o"  # Keep it secure, only in backend

@app.route("/")
def home():
    return "Welcome to the YouTube Comment Sentiment Analysis API!"

@app.route("/analyze", methods=["POST"])
def analyze():
    print("🔧 /api/analyze route has been hit!")
    print("Received request to /api/analyze")
    data = request.get_json()
    app.logger.info(data)
    video_url = data.get("video_url")
    print(f"Received URL: {video_url}")

    if not video_url:
        return jsonify({"error": "No YouTube URL provided"}), 400

    try:
        video_id = fetch_and_store_comments(video_url, API_KEY)
        if not video_id:
            return jsonify({"error": "Could not extract video ID or fetch comments."}), 400

        # Process and update sentiments
        conn = sqlite3.connect("comments.db")
        c = conn.cursor()
        c.execute("SELECT comment, user_id FROM comments WHERE flag = 0 AND video_id = ?", (video_id,))
        rows = c.fetchall()
        conn.close()

        for comment, user_id in rows:
            sentiment = predict_sentiment(comment)
            update_comment_sentiment(video_id, user_id, sentiment)

        # Generate pie chart
        # generate_pie_chart(video_id)

        # Get top comments
        top_comments = fetch_top_comments(video_id)
        # pie_chart_path = "sentiment_pie_chart.png"

        print(f"Sending response: {jsonify({'video_id': video_id, 'top_comments': [{'comment': c, 'sentiment': s} for c, s in top_comments]})}")


        return jsonify({
            "video_id": video_id,
            "top_comments": [{"comment": c, "sentiment": s} for c, s in top_comments],
            # "pie_chart": pie_chart_path
        }), 200
        

    except Exception as e:
        print(f"Error in analyze route: {e}")
        return jsonify({"error": "An unexpected error occurred on the server."}), 500

if __name__ == "__main__":
    app.run(debug=True)

# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from fetch_comments import fetch_and_store_comments
# from predictions import predict_sentiment
# from pie_chart import generate_pie_chart
# from database import update_comment_sentiment, fetch_top_comments
# import sqlite3
# import os

# app = Flask(__name__)
# CORS(app)

# def process_comments(video_id, batch_size=100):
#     conn = sqlite3.connect("comments.db")
#     c = conn.cursor()
#     c.execute("SELECT comment, user_id FROM comments WHERE flag = 0 AND video_id = ?", (video_id,))
#     rows = c.fetchall()
#     conn.close()

#     for i in range(0, len(rows), batch_size):
#         batch = rows[i:i + batch_size]
#         for comment, user_id in batch:
#             sentiment = predict_sentiment(comment)
#             update_comment_sentiment(video_id, user_id, sentiment)

# @app.route("/analyze", methods=["POST"])
# def analyze():
#     data = request.get_json()
#     video_url = data.get("video_url")

#     if not video_url:
#         return jsonify({"error": "Missing video_url"}), 400

#     try:
#         video_id = fetch_and_store_comments(video_url, api_key="AIzaSyBd8jlB-okHbUVVkr3zugO17KmNb2QO__o")
#         if not video_id:
#             return jsonify({"error": "Invalid YouTube URL"}), 400

#         process_comments(video_id)
#         top_comments = fetch_top_comments(video_id)

#         response = {
#             "video_id": video_id,
#             "top_comments": [{"comment": c, "sentiment": s} for c, s in top_comments]
#         }

#         return jsonify(response)

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/chart/<video_id>")
# def chart(video_id):
#     chart_path = "sentiment_pie_chart.png"
#     if not os.path.exists(chart_path):
#         generate_pie_chart(video_id)
#     return send_file(chart_path, mimetype="image/png")

# if __name__ == "__main__":
#     app.run(debug=True)
