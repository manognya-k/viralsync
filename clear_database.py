import sqlite3

def clear_comments_table():
    conn = sqlite3.connect('comments.db')
    cursor = conn.cursor()

    cursor.execute('DELETE FROM comments')
    conn.commit()
    conn.close()
    print("All data from 'comments' table has been cleared.")

if __name__ == "__main__":
    clear_comments_table()
