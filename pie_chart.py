# import matplotlib.pyplot as plt
# import sqlite3

# def generate_pie_chart():
#     conn = sqlite3.connect('comments.db')
#     c = conn.cursor()
#     c.execute('''
#         SELECT sentiment, COUNT(*) FROM comments
#         WHERE flag = 1
#         GROUP BY sentiment
#     ''')
    
#     data = c.fetchall()
#     conn.close()
    
#     labels = [item[0] for item in data]
#     sizes = [item[1] for item in data]
    
#     plt.pie(sizes, labels=labels, autopct='%1.1f%%')
#     plt.title('Sentiment Analysis Distribution')
#     plt.show()

import sqlite3
import matplotlib.pyplot as plt

def generate_pie_chart(video_id):
    conn = sqlite3.connect("comments.db")
    c = conn.cursor()

    # Count sentiments across ALL processed comments
    c.execute('''
        SELECT sentiment, COUNT(*) 
        FROM comments 
        WHERE flag = 1 AND video_id = ?
        GROUP BY sentiment
    ''', (video_id,))

    results = c.fetchall()
    conn.close()

    if not results:
        print("No sentiment data available to generate pie chart.")
        return

    labels = [row[0] for row in results]
    sizes = [row[1] for row in results]
    colors = ['#66b3ff', '#99ff99', '#ff9999', '#ffcc99', '#c2c2f0']

    plt.figure(figsize=(7, 7))
    plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%',
            startangle=140, shadow=True)
    plt.axis('equal')
    plt.title('Sentiment Distribution of All Comments')
    plt.tight_layout()
    plt.savefig('sentiment_pie_chart.png')
    plt.show()

