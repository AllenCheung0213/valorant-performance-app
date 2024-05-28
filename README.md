# Valorant Performance Prediction App

This project is a Valorant performance prediction app that uses machine learning to predict player performance and provide improvement recommendations.

## Features

- **Player Performance Prediction**: Predicts the win rate based on historical gameplay data.
- **Personalized Recommendations**: Provides recommendations to improve gameplay.
- **OAuth2 Authentication**: Allows users to log in with their Riot Games account.
- **Interactive Dashboard**: Visualizes performance metrics and trends.

## Project Structure

valorant-performance-app/
│
├── backend/
│ ├── main.py
│ ├── performance_model.joblib
│ ├── gameplay_data.csv
│ ├── train_model.py
│ ├── .env
│ ├── Dockerfile
│ ├── requirements.txt
│ └── README.md
│
├── frontend/
│ ├── public/
│ │ ├── index.html
│ │ └── ...
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ └── ...
│ ├── .env
│ ├── package.json
│ ├── package-lock.json
│ ├── Dockerfile
│ └── README.md
│
├── .gitignore
├── docker-compose.yml
└── README.md


## Installation

### Backend

1. **Navigate to the backend directory**:

    ```bash
    cd backend
    ```

2. **Create a virtual environment and activate it**:

    ```bash
    python -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```

3. **Install the dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the FastAPI server**:

    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1. **Navigate to the frontend directory**:

    ```bash
    cd frontend
    ```

2. **Install the dependencies**:

    ```bash
    npm install
    ```

3. **Start the React application**:

    ```bash
    npm start
    ```

### Using Docker Compose

1. **Run both services using Docker Compose**:

    ```bash
    docker-compose up --build
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
