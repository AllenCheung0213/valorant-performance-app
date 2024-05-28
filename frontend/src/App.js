import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
    const [predictions, setPredictions] = useState(null);
    const [matchData, setMatchData] = useState([]);

    const fetchPredictions = async () => {
        try {
            const response = await axios.post('http://localhost:8000/predict', {
                player_id: 'example-player-id',
                match_data: matchData
            });
            setPredictions(response.data);
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    };

    useEffect(() => {
        fetchPredictions();
    }, [matchData]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Valorant Performance Prediction</h1>
                {predictions ? (
                    <div>
                        <h2>Predicted Win Rate: {predictions.win_rate_prediction}</h2>
                        <h3>Recommendations:</h3>
                        <ul>
                            {predictions.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Loading predictions...</p>
                )}
            </header>
        </div>
    );
}

export default App;
