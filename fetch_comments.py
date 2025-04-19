# import requests
# import sqlite3

# def fetch_comments(video_id, api_key):
#     # YouTube API endpoint
#     url = f'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={video_id}&key={api_key}'
    
#     response = requests.get(url)
#     comments_data = response.json()
    
#     comments = []
#     for item in comments_data['items']:
#         comment = item['snippet']['topLevelComment']['snippet']['textOriginal']
#         user_id = item['snippet']['topLevelComment']['snippet']['authorChannelId']['value']
#         timestamp = item['snippet']['topLevelComment']['snippet']['publishedAt']
        
#         comments.append((video_id, user_id, comment, timestamp))
    
#     return comments

# def store_comments_in_db(comments):
#     conn = sqlite3.connect('comments.db')
#     c = conn.cursor()
#     c.executemany('''INSERT INTO comments (video_id, user_id, comment, timestamp, sentiment, flag) VALUES (?, ?, ?, ?, ?, ?)''', 
#                   [(video_id, user_id, comment, timestamp, None, 0) for video_id, user_id, comment, timestamp in comments])
#     conn.commit()
#     conn.close()


import requests
import sqlite3
import time
import re
from urllib.parse import urlparse, parse_qs

def extract_video_id(youtube_url):
    """
    Extracts video ID from various YouTube URL formats.
    """
    parsed_url = urlparse(youtube_url)
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        return parse_qs(parsed_url.query).get("v", [None])[0]
    elif parsed_url.hostname == "youtu.be":
        return parsed_url.path[1:]
    else:
        return None

def fetch_and_store_comments(video_url, api_key):
    video_id = extract_video_id(video_url)
    if not video_id:
        print("Invalid YouTube URL.")
        return

    base_url = "https://www.googleapis.com/youtube/v3/commentThreads"
    params = {
        "part": "snippet",
        "videoId": video_id,
        "key": api_key,
        "textFormat": "plainText",
        "maxResults": 100
    }

    next_page_token = None
    print("Fetching comments...")

    while True:
        if next_page_token:
            params["pageToken"] = next_page_token

        response = requests.get(base_url, params=params)
        data = response.json()

        if "items" not in data:
            print("No comments found or error occurred.")
            break

        conn = sqlite3.connect("comments.db")
        cursor = conn.cursor()

        for item in data["items"]:
            comment = item["snippet"]["topLevelComment"]["snippet"]
            user_id = item["snippet"]["topLevelComment"]["id"]
            text = comment["textDisplay"]
            timestamp = comment["publishedAt"]

            # Insert into DB if not already present
            cursor.execute('''
                SELECT 1 FROM comments WHERE video_id = ? AND user_id = ?
            ''', (video_id, user_id))
            if not cursor.fetchone():
                cursor.execute('''
                    INSERT INTO comments (video_id, user_id, comment, timestamp, sentiment, flag)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (video_id, user_id, text, timestamp, '', 0))

        conn.commit()
        conn.close()

        next_page_token = data.get("nextPageToken")
        if not next_page_token:
            break

        time.sleep(1)  # To respect YouTube API rate limits

    print("Comments fetched and stored in DB.")
    return video_id  # Return the extracted video_id for further steps
