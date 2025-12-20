# Recomment Service

This service provides user recommendations using both TF-IDF based and Semantic (Embedding) based approaches. It interacts with MongoDB to fetch user data and generate compatibility scores.

## Tech Stack

- **Language:** Python
- **Web Framework:** Flask
- **Server:** Gunicorn
- **Database:** MongoDB (via MongoEngine & PyMongo)
- **Data Processing & ML:**
  - Pandas
  - NumPy
  - Scikit-learn
  - Sentence Transformers
- **Monitoring:** Prometheus Client

## API Endpoints

### 1. TF-IDF Recommendation

Based on user profile data processed using TF-IDF.

- **URL:** `/recommend/<user_id>/<top_k>`
- **Method:** `GET`
- **Parameters:**
  - `user_id` (string): The ID of the user to generate recommendations for.
  - `top_k` (int): The number of recommendations to return.
- **Response:** JSON object containing a list of recommended users with compatibility scores.

### 2. Semantic Recommendation

Based on semantic embeddings of user profiles using Sentence Transformers.

- **URL:** `/recommend/semantic/<user_id>`
- **Method:** `GET`
- **Parameters:**
  - `user_id` (string): The ID of the user to generate recommendations for.
- **Response:** JSON object containing a list of recommended users (defaults to top 5) with compatibility scores.

### 3. Health Check

Simple endpoint to verify the service is running.

- **URL:** `/`
- **Method:** `GET`
- **Response:** "Hello world"

### 4. Metrics

Exposes Prometheus metrics.

- **URL:** `/metrics`
- **Method:** `GET`
- **Response:** Prometheus metrics data.

## Setup & Run

1.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables:**
    Ensure you have a `.env` file with the necessary configurations (e.g., `MONGO_URI`, `MONGO_DB`).

3.  **Run the Application:**
    ```bash
    python run.py
    ```
    Or using Gunicorn:
    ```bash
    gunicorn -w 4 -b 0.0.0.0:5000 run:app
    ```
