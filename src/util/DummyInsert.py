import random
import mysql.connector
import uuid

# Define the number of rows to generate
num_rows = 5000

# Define the range of values for the number attributes
security_question_id_range = range(1, 4)

# Generate the list of unique security_question_ids
unique_security_question_ids = random.sample(security_question_id_range, len(security_question_id_range))

# Generate the dummy data
rows = []
for i in range(1,num_rows+1):
    id = i
    security_question_id = unique_security_question_ids[i % len(unique_security_question_ids)]
    answer = "answer_{}".format(i)
    account_id = str(uuid.uuid4())
    security_answer_identifier = "{}:{}".format(account_id, security_question_id)
    created_at = '0000-00-00'
    updated_at = '0000-00-00'
    
    rows.append((id, security_question_id, answer, security_answer_identifier, account_id, created_at, updated_at))

# Connect to the MySQL database
cnx = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="growsari_iam"
)

# Prepare the INSERT statement
cursor = cnx.cursor()
insert_stmt = (
    "INSERT INTO security_answer (id, security_question_id, answer, security_answer_identifier, account_id, created_at, updated_at) "
    "VALUES (%s, %s, %s, %s, %s, %s, %s)"
)

# Insert the rows into the table
for row in rows:
    cursor.execute(insert_stmt, row)

# Commit the changes
cnx.commit()

# Close the cursor and connection
cursor.close()
cnx.close()

