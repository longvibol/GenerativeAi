import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const apiKey = 'aa80c320c5f4d62b89e95aab6345b411'; // Replace with your OpenWeatherMap API key

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.main) {
        setTemperature(data.main.temp);
        setCity(data.name);
      } else {
        setError('Weather data not found');
        setTemperature(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Error fetching weather');
      setTemperature(null);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission denied');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });
      fetchWeatherByCoords(latitude, longitude);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Could not get location');
      setLoading(false);
    }
  }, [fetchWeatherByCoords]);

  useEffect(() => {
    getCurrentLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Weather at Your Location</Text>

      <Button title="Refresh Location & Weather" onPress={getCurrentLocation} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {temperature !== null && !loading && (
        <Text style={styles.temp}>
          {city ? `${city}: ` : ''}Temperature: {temperature}°C
        </Text>
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
          <Marker coordinate={location} title={city || 'Your Location'} />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  temp: {
    fontSize: 22,
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