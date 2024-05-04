import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Flood = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
      (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
          }

          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
      })();
  }, []);

  return (
      <View style={styles.container}>
          <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 24.0, 
                    longitude: 90.0, 
                    latitudeDelta: 10, 
                    longitudeDelta: 10,
                }}
            >
              {location && (
                  <Marker
                      coordinate={{
                          latitude: location.coords.latitude,
                          longitude: location.coords.longitude,
                      }}
                      title="Your Location"
                  />
              )}
          </MapView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  map: {
      width: '100%',
      height: '100%',
  },
});

export default Flood