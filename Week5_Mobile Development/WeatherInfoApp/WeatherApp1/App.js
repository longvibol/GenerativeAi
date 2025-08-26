import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';

const cityCoordinates = {
  'Phnom Penh': { latitude: 11.5564, longitude: 104.9282 },
  'Bangkok': { latitude: 13.7563, longitude: 100.5018 },
  'Tokyo': { latitude: 35.6762, longitude: 139.6503 },
  'New York': { latitude: 40.7128, longitude: -74.0060 },
  'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
  'Chicago': { latitude: 41.8781, longitude: -87.6298 },
  'Houston': { latitude: 29.7604, longitude: -95.3698 },
  'Seattle': { latitude: 47.6062, longitude: -122.3321 },
  'Boston': { latitude: 42.3601, longitude: -71.0589 },
  'San Francisco': { latitude: 37.7749, longitude: -122.4194 },
  'Miami': { latitude: 25.7617, longitude: -80.1918 },
  'Dallas': { latitude: 32.7767, longitude: -96.7970 },
  'Atlanta': { latitude: 33.7490, longitude: -84.3880 },
};

export default function App() {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError('');
    try {
      const apiKey = 'aa80c320c5f4d62b89e95aab6345b411'; // Replace with your OpenWeatherMap API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();

      if (data.main) {
        setTemperature(data.main.temp);
      } else {
        setError('City not found');
        setTemperature(null);
      }
    } catch (err) {
      setError('Error fetching weather');
      setTemperature(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    const coords = cityCoordinates[selectedCity];
    if (coords) setLocation(coords);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤️ Weather App</Text>

      <Text style={styles.label}>Select a city:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={city}
          onValueChange={handleCityChange}
          style={styles.picker}
        >
          <Picker.Item label="-- Choose City --" value="" />
          {Object.keys(cityCoordinates).map((cityName) => (
            <Picker.Item key={cityName} label={cityName} value={cityName} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Or enter manually:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
      />

      <View style={styles.buttonWrapper}>
        <Button title="Get Weather" onPress={fetchWeather} />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {temperature !== null && !loading && (
        <Text style={styles.temp}>Temperature: {temperature}°C</Text>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {location.latitude !== 0 && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={location} title={city} />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    marginBottom: 20,
    paddingHorizontal: 40,
    alignSelf: 'center',
  },
  temp: {
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    color: '#444',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
});