import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env file")
    exit()

# Change driver to psycopg for PostgreSQL or keep as is for SQLite
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

engine = create_engine(DATABASE_URL)

def migrate():
    print("Starting migration...")
    with engine.connect() as conn:
        # Check and add 'category' column - different syntax for SQLite vs PostgreSQL
        try:
            if DATABASE_URL.startswith("sqlite"):
                # SQLite doesn't support adding columns with NOT NULL and DEFAULT in one step
                # First add the column allowing NULL
                conn.execute(text("ALTER TABLE tasks ADD COLUMN category VARCHAR;"))
                # Then update all existing rows to have the default value
                conn.execute(text("UPDATE tasks SET category = 'General' WHERE category IS NULL;"))
                # Then alter the column to be NOT NULL (SQLite doesn't enforce this at DB level though)
                print("Successfully added 'category' column to SQLite table.")
            else:
                # PostgreSQL syntax
                conn.execute(text("ALTER TABLE tasks ADD COLUMN category VARCHAR DEFAULT 'General' NOT NULL;"))
                print("Successfully added 'category' column.")
        except Exception as e:
            print(f"Note: Could not add 'category' (maybe it already exists?): {e}")

        # Check and add 'priority' column
        try:
            if DATABASE_URL.startswith("sqlite"):
                # SQLite doesn't support adding columns with NOT NULL and DEFAULT in one step
                # First add the column allowing NULL
                conn.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR;"))
                # Then update all existing rows to have the default value
                conn.execute(text("UPDATE tasks SET priority = 'Medium' WHERE priority IS NULL;"))
                # Then alter the column to be NOT NULL (SQLite doesn't enforce this at DB level though)
                print("Successfully added 'priority' column to SQLite table.")
            else:
                # PostgreSQL syntax
                conn.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR DEFAULT 'Medium' NOT NULL;"))
                print("Successfully added 'priority' column.")
        except Exception as e:
            print(f"Note: Could not add 'priority' (maybe it already exists?): {e}")

        conn.commit()
    print("Migration finished!")

if __name__ == "__main__":
    migrate()