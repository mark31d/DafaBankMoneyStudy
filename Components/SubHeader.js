import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const SubHeader = ({ title, onBack, onSave }) => {
  return (
    <View style={styles.subHeader}>
      <TouchableOpacity onPress={onBack}>
        <Image source={require('../assets/arrowLeft.png')} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSave}>
        <Image source={require('../assets/checkIcon.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#A10B02',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
});

export default SubHeader;
