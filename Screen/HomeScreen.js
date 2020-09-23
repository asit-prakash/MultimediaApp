import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  Image,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Contacts from 'react-native-contacts';
import DocumentPicker from 'react-native-document-picker';

const HomeScreen = (props) => {
  const [loadPhotos, setLoadPhotos] = useState();

  const openCamera = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.CAMERA'] === 'granted' &&
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' &&
      granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
      granted['android.permission.RECORD_AUDIO'] === 'granted'
    ) {
      props.navigation.navigate('Camera');
    }
  };

  const getImages = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
      groupTypes: 'Album',
    })
      .then((r) => {
        setLoadPhotos(r.edges);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllAlbums = () => {
    CameraRoll.getAlbums({
      assetType: 'All',
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(`[ERROR]:: ${err}`);
      });
  };

  const getAllContacts = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            console.log(err);
          } else {
            console.log(contacts);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createContact = () => {
    var newPerson = {
      emailAddresses: [
        {
          label: '',
          email: '',
        },
      ],
      displayName: '',
    };
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept ',
    }).then(() => {
      Contacts.openContactForm(newPerson, (err, contact) => {
        if (err) {
          console.log(err);
        }
      });
    });
  };

  const openFileManager = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const openBarCodeReader = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Bar Code Scanning needs Camera Permission',
        message:
          'Bar Code Scanner needs access to your camera ' +
          'so you can scan Bar Code.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      props.navigation.navigate('BarCode');
    }
  };

  const openLink = async () => {
    const url = 'https://google.com';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View>
      <Button title="Open Camera" onPress={openCamera} />
      <Button title="load images" onPress={getImages} />
      <Button title="load albums" onPress={getAllAlbums} />
      <Button title="Load Contacts" onPress={getAllContacts} />
      <Button title="Create Contact" onPress={createContact} />
      <Button title="Open File Manager" onPress={openFileManager} />
      <Button title="Open Bar Code Scanner" onPress={openBarCodeReader} />
      <Button title="Open Link" onPress={openLink} />

      <View>
        <ScrollView>
          {loadPhotos &&
            loadPhotos.map((p, i) => {
              return (
                <Image
                  key={i}
                  style={{
                    width: 300,
                    height: 100,
                  }}
                  source={{uri: p.node.image.uri}}
                />
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};
export default HomeScreen;
