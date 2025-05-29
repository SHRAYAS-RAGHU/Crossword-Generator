# Crossword Puzzle Application

This application features an Angular frontend and a Python (Flask) backend to deliver an interactive crossword puzzle experience.

## Project Structure

-   `angular-frontend/`: Contains the Angular UI application.
-   `python-backend/`: Contains the Python Flask API for serving puzzle data and validating answers.

## Setup and Running

### Python Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd python-backend
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask application:**
    ```bash
    flask run --port 5001
    # Or python app.py
    ```
    The backend will be available at `http://localhost:5001`.

### Angular Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd angular-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Angular development server:**
    ```bash
    ng serve
    ```
    The frontend will be available at `http://localhost:4200` and will connect to the Python backend.

## Features

* Dynamic crossword grid generation based on backend data.
* Across and Down hints display.
* Input cells for users to type answers.
* Real-time answer validation against the backend.
* Highlighting of silent letters upon correct answer submission.
* Responsive design for hints and grid layout.

## Crossword Data

The crossword puzzle data is sourced from `python-backend/data/word_list.json`. This includes:
* Puzzle title
* Grid dimensions
* Word details:
    * Clue number
    * Clue text
    * Answer
    * Direction (across/down)
    * Start row and column
    * Indices of silent letters within the answer

## API Endpoints (Python Backend)

* `GET /api/crossword`: Fetches the crossword puzzle structure (clues, lengths, positions, but not answers).
* `POST /api/validate`: Validates a user's submitted answer for a specific word.
    * Request body: `{ "number": <int>, "direction": <"across"|"down">, "attempt": "<string>" }`
    * Response body (on correct): `{ "correct": true, "answer": "<string>", "silent_indices": [<int>] }`
    * Response body (on incorrect): `{ "correct": false }`