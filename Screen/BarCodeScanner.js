import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Button, Alert, Linking} from 'react-native';
import {RNCamera} from 'react-native-camera';

const BarCodeScanner = () => {
  const camera = useRef(null);

  const [toggleFlash, setToggleFlash] = useState(
    RNCamera.Constants.FlashMode.off,
  );

  const toggleFlashMode = () => {
    let currFlashMode = toggleFlash;
    if (currFlashMode === RNCamera.Constants.FlashMode.off) {
      currFlashMode = RNCamera.Constants.FlashMode.torch;
    } else {
      currFlashMode = RNCamera.Constants.FlashMode.off;
    }
    setToggleFlash(currFlashMode);
  };

  const barCodeReadHandler = async (e) => {
    if (e.type == 'QR_CODE') {
      const supported = await Linking.canOpenURL(e.data);
      if (supported) {
        await Linking.openURL(e.data);
      } else {
        Alert.alert(`Don't know how to open this qr_code : ${e.data}`);
      }
    } else if (e.type == 'UPC_E') {
      const supported = await Linking.canOpenURL(e.data);
      if (supported) {
        await Linking.openURL(e.data);
      } else {
        Alert.alert(`Don't know how to open this upce : ${e.data}`);
      }
    } else {
      Alert.alert('Barcode value is' + e.data, 'Barcode type is' + e.type);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={camera}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        style={{flex: 1}}
        flashMode={toggleFlash}
        onBarCodeRead={barCodeReadHandler}
        type={RNCamera.Constants.Type.back}>
        <Button title="flash" onPress={toggleFlashMode} />
      </RNCamera>
    </View>
  );
};

export default BarCodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});
