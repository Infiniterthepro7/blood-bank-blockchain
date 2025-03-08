import psycopg2

# Function to connect to PostgreSQL
def connect_db():
    conn = psycopg2.connect(
        dbname="bloodbank",
        user="postgres",
        password="aryan@123",  # Change this!
        host="localhost",
        port="5432"
    )
    return conn

# Example function to fetch all donors
def get_donors():
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM donors;")
    donors = cur.fetchall()
    conn.close()
    return donors

# Test database connection
if __name__ == "__main__":
    print(get_donors())
