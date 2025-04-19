# from fetch_comments import fetch_comments, store_comments_in_db
# from predictions import load_model_and_tokenizer, predict_sentiment
# from database import update_comment_sentiment, fetch_top_comments
# from pie_chart import generate_pie_chart

# def main():
#     video_id = input("Enter YouTube video ID: ")
#     api_key = 'AIzaSyBd8jlB-okHbUVVkr3zugO17KmNb2QO__o'  # Replace with your API key
    
#     # Fetch and store comments in database
#     comments = fetch_comments(video_id, api_key)
#     store_comments_in_db(comments)
    
#     # Load model and tokenizer
#     model, tokenizer, label_encoder = load_model_and_tokenizer('models/cnn_lstm_sentiment_model.h5', 'assets/tokenizer.pkl', 'assets/label_encoder.pkl')
    
#     # Get all comments from the database
#     conn = sqlite3.connect('comments.db')
#     c = conn.cursor()
#     c.execute('SELECT comment, video_id, user_id FROM comments WHERE flag = 0')
#     comments_to_predict = c.fetchall()
#     conn.close()
    
#     # Predict sentiment for each comment
#     for comment, video_id, user_id in comments_to_predict:
#         sentiment = predict_sentiment(model, tokenizer, label_encoder, [comment])[0]
#         update_comment_sentiment(video_id, user_id, sentiment)
    
#     # Generate pie chart
#     generate_pie_chart()
    
#     # Display top 20 comments
#     top_comments = fetch_top_comments()
#     print("\nTop 20 Comments:")
#     for comment, sentiment in top_comments:
#         print(f"Sentiment: {sentiment}, Comment: {comment}")

# if __name__ == "__main__":
#     main()


from fetch_comments import fetch_and_store_comments
from pie_chart import generate_pie_chart
from predictions import predict_sentiment
from database import update_comment_sentiment, fetch_top_comments

import sqlite3

def process_comments(video_id,batch_size=100):
    conn = sqlite3.connect("comments.db")
    c = conn.cursor()
    c.execute("SELECT comment, user_id FROM comments WHERE flag = 0 AND video_id = ?", (video_id,))
    rows = c.fetchall()
    conn.close()

    print(f"Processing {len(rows)} comments in batches of {batch_size}...")
    # for comment, user_id in rows:
    #     sentiment = predict_sentiment(comment)
    #     update_comment_sentiment(video_id, user_id, sentiment)
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        
        # Process each comment in the current batch
        for comment, user_id in batch:
            sentiment = predict_sentiment(comment)
            update_comment_sentiment(video_id, user_id, sentiment)

        # Optionally, print a progress update after each batch
        print(f"Processed batch {i // batch_size + 1} of {len(rows) // batch_size + 1}")

    print("All comments processed successfully.")

def display_top_comments(video_id):
    top_comments = fetch_top_comments(video_id)
    print("\nTop 20 Comments (Latest):")
    for comment, sentiment in top_comments:
        print(f"[{sentiment.upper()}] {comment}")

if __name__ == "__main__":
    video_url = input("Enter YouTube Video URL: ")
    api_key = "AIzaSyBd8jlB-okHbUVVkr3zugO17KmNb2QO__o"  # Replace with your actual API key

    video_id = fetch_and_store_comments(video_url, api_key)
    if video_id:
        process_comments(video_id, batch_size=100)
        display_top_comments(video_id)
        generate_pie_chart(video_id)
