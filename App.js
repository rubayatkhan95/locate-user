import React from 'react';
import {View, Text} from 'react-native';
import MapComponent from './views/MapComponent';

const App = () => {
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <MapComponent />
    </View>
  );
};

export default App;
