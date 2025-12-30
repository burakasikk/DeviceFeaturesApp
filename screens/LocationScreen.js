import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';

// Bildirimlerin uygulama açıkken de görünmesi için gerekli ayar
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function LocationScreen() {
  const [coords, setCoords] = useState(null);

  const getLocation = async () => {
    // 1. Konum İzni İsteme
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Konum izni gerekli');
      return;
    }

    // 2. Konumu Alma
    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);

    // 3. Bildirim Gönderme
    const { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus === 'granted') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Konum Alındı',
          body: 'GPS konumunuz başarıyla alındı.',
        },
        trigger: null, // Hemen gönder
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Mevcut Konumu Al" onPress={getLocation} />
      
      {coords && (
        <Text style={styles.text}>
          Enlem: {coords.latitude} {"\n"}
          Boylam: {coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});