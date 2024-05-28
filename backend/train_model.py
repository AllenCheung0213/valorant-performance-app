import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

# Load the data
data = pd.read_csv('gameplay_data.csv')  # Replace with your actual data file

# Preprocess the data
# Assuming the data has columns like 'kills', 'deaths', 'assists', 'win_rate', etc.
X = data.drop(columns=['player_id', 'win_rate'])
y = data['win_rate']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f"Mean Absolute Error: {mae}")

# Save the model
joblib.dump(model, 'performance_model.joblib')
