import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob';
import {captureScreen} from 'react-native-view-shot';

import Icon from 'react-native-vector-icons/Ionicons';

const CameraScreen = () => {
  const camera = useRef(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [toggleFlash, setToggleFlash] = useState(
    RNCamera.Constants.FlashMode.off,
  );
  const [captureMode, setCaptureMode] = useState('photo');
  const [isRecording, setIsRecording] = useState(false);

  const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Waiting</Text>
    </View>
  );

  const changeCameraType = () => {
    let currCamera = cameraType;
    if (currCamera === RNCamera.Constants.Type.back) {
      currCamera = RNCamera.Constants.Type.front;
    } else {
      currCamera = RNCamera.Constants.Type.back;
    }
    setCameraType(currCamera);
  };

  const toggleFlashMode = () => {
    let currFlashMode = toggleFlash;
    if (currFlashMode === RNCamera.Constants.FlashMode.off) {
      currFlashMode = RNCamera.Constants.FlashMode.on;
    } else {
      currFlashMode = RNCamera.Constants.FlashMode.off;
    }
    setToggleFlash(currFlashMode);
  };

  const takePicture = async () => {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
      };
      const data = await camera.current.takePictureAsync(options);
      const img = data.uri.substring(data.uri.lastIndexOf('/') + 1);
      const path = `${RNFetchBlob.fs.dirs.DCIMDir}/${img}`;
      try {
        RNFetchBlob.fs.writeFile(path, data.base64, 'base64');
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const onRecordingStart = () => {
    setIsRecording(true);
  };

  const recordVideo = async () => {
    if (camera) {
      const options = {
        quality: '480p',
        maxDuration: 60,
        maxFileSize: 100 * 1024 * 1024,
      };
      const data = await camera.current.recordAsync(options);
      console.log(data);
      const timestamp = new Date().toISOString();
      const videoName = `Video${timestamp}`;
      RNFetchBlob.fs
        .cp(data.uri, `${RNFetchBlob.fs.dirs.DCIMDir}/${videoName}.mp4`)
        .then(() => {
          console.log('video saved');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const stopRecordingVideo = () => {
    camera.current.stopRecording();
    setIsRecording(false);
  };

  const flipCaptureMode = () => {
    if (captureMode === 'photo') {
      setCaptureMode('video');
    } else {
      setCaptureMode('photo');
    }
  };

  const capture = () => {
    if (captureMode === 'photo') {
      takePicture();
    } else {
      if (isRecording === true) {
        stopRecordingVideo();
      } else {
        recordVideo();
      }
    }
  };

  const takeSnapshot = () => {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
      result: 'base64',
    }).then(
      (uri) => {
        const timestamp = new Date().toISOString();
        const imgName = `Screenshot${timestamp}.jpg`;
        const path = `${RNFetchBlob.fs.dirs.DCIMDir}/${imgName}`;
        try {
          RNFetchBlob.fs.writeFile(path, uri, 'base64');
        } catch (error) {
          console.log(error.message);
        }
      },
      (error) => console.error('Oops, snapshot failed', error),
    );
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={camera}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        style={styles.preview}
        type={cameraType}
        flashMode={toggleFlash}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onRecordingStart={onRecordingStart}
        captureAudio={true}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to record your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status, recordAudioPermissionStatus}) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => capture(camera)}
                style={styles.capture}>
                <Icon name="aperture" size={30} color="#900" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleFlashMode}
                style={styles.capture}>
                <Icon
                  name={
                    toggleFlash === RNCamera.Constants.FlashMode.on
                      ? 'flash-off'
                      : 'flash'
                  }
                  size={30}
                  color="#900"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={changeCameraType}
                style={styles.capture}>
                <Icon name="camera-reverse" size={30} color="#900" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={flipCaptureMode}
                style={styles.capture}>
                <Icon
                  name={captureMode === 'photo' ? 'camera' : 'videocam'}
                  size={30}
                  color="#900"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={takeSnapshot} style={styles.capture}>
                <Icon name="scan" size={30} color="#900" />
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    alignSelf: 'center',
    margin: 20,
  },
});
export default CameraScreen;
