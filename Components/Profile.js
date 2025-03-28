import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  // Profile data
  const [name, setName] = useState('Name');
  const [surname, setSurname] = useState('Surname');
  const [email, setEmail] = useState('@gmail');
  const [photoUri, setPhotoUri] = useState(null);

  // Screen mode: 'view' or 'edit'
  const [screenMode, setScreenMode] = useState('view');

  // Temp fields for editing
  const [tempName, setTempName] = useState('');
  const [tempSurname, setTempSurname] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempPhotoUri, setTempPhotoUri] = useState(null);

  // Enter edit mode: load current data into temp fields
  const handleEditPress = () => {
    setTempName(name);
    setTempSurname(surname);
    setTempEmail(email);
    setTempPhotoUri(photoUri);
    setScreenMode('edit');
  };

  // Cancel editing and return to view mode
  const handleCancelEdit = () => {
    setScreenMode('view');
  };

  // Save profile: update main state and store photoUri
  const handleSaveProfile = async () => {
    if (!tempEmail) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }
    setName(tempName);
    setSurname(tempSurname);
    setEmail(tempEmail);
    setPhotoUri(tempPhotoUri);
    try {
      await AsyncStorage.setItem('profilePhoto', tempPhotoUri || '');
    } catch (error) {
      console.error('Error saving profile photo:', error);
    }
    setScreenMode('view');
  };

  // Launch image picker (using react-native-image-picker)
  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setTempPhotoUri(asset.uri);
      }
    });
  };

  if (screenMode === 'view') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.iconButton} onPress={handleEditPress}>
            <Image
              source={require('../assets/editIcon.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.center}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Image
                  source={require('../assets/profile.png')}
                  style={styles.placeholderIcon}
                />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>
            {name} {surname}
          </Text>
          <Text style={styles.profileEmail}>{email}</Text>

          <TouchableOpacity style={styles.listButton} onPress={() => Alert.alert('Coming Soon', 'Developer Website will be available soon.')}>
            <Text style={styles.listButtonText}>Developer Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listButton} onPress={() => Alert.alert('Coming Soon', 'Privacy Policy will be available soon.')}>
            <Text style={styles.listButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listButton} onPress={() => Alert.alert('Coming Soon', 'Terms of Use will be available soon.')}>
            <Text style={styles.listButtonText}>Terms of Use</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Edit Mode
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCancelEdit}>
          <Image
            source={require('../assets/arrowLeft.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleSaveProfile}>
          <Image
            source={require('../assets/checkIcon.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.center}>
          <TouchableOpacity onPress={handlePickImage}>
            {tempPhotoUri ? (
              <Image source={{ uri: tempPhotoUri }} style={styles.profileImageEdit} />
            ) : (
              <View style={styles.profilePlaceholderEdit}>
                <Image
                  source={require('../assets/profile.png')}
                  style={styles.placeholderIcon}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.formInput}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={tempName}
          onChangeText={setTempName}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Surname"
          placeholderTextColor="#aaa"
          value={tempSurname}
          onChangeText={setTempSurname}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={tempEmail}
          onChangeText={setTempEmail}
        />
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B0000',
  },
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // title centered, buttons at edges
    paddingTop: 62,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 8,
  },
  headerIcon: {
    width: 18,
    height: 18,
    tintColor: '#000',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    resizeMode: 'cover',
  },
  profilePlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#852A2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    tintColor: '#aaa',
    resizeMode: 'contain',
  },
  profileName: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  listButton: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileImageEdit: {
    width: 130,
    height: 130,
    borderRadius: 65,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  profilePlaceholderEdit: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#852A2B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  formInput: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
});
