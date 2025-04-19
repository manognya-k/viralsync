import sqlite3

# Initialize database connection
def init_db():
    conn = sqlite3.connect('comments.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            video_id TEXT,
            user_id TEXT,
            comment TEXT,
            timestamp TEXT,
            sentiment TEXT,
            flag INTEGER
        )
    ''')
    conn.commit()
    conn.close()

# Update sentiment and flag in database
def update_comment_sentiment(video_id, user_id, sentiment):
    conn = sqlite3.connect('comments.db')
    c = conn.cursor()
    c.execute('''
        UPDATE comments
        SET sentiment = ?, flag = 1
        WHERE video_id = ? AND user_id = ?
    ''', (sentiment, video_id, user_id))
    conn.commit()
    conn.close()

# Fetch top 20 comments by sentiment
def fetch_top_comments(video_id):
    conn = sqlite3.connect('comments.db')
    c = conn.cursor()
    c.execute('''
        SELECT comment, sentiment
        FROM comments
        WHERE flag = 1 AND video_id=?
        ORDER BY timestamp DESC
        LIMIT 20
    ''', (video_id,))
    top_comments = c.fetchall()
    conn.close()
    return top_comments
if __name__ == "__main__":
    init_db()
    print("Database initialized.")