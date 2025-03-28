import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TAB_BAR_BG = '#A73537';  // Основной цвет заднего фона панели
const INACTIVE_BG = '#914040';
const ACTIVE_BG = '#FFFFFF';
const INACTIVE_COLOR = '#8B0A02';
const ACTIVE_COLOR = '#8B0A02';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    // Корневой контейнер таб-бара с абсолютным позиционированием
    <View
      style={[
        styles.container,
        {
          // Учитываем нижний отступ (SafeArea)
          height: 75 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Фоновая подложка с закруглёнными углами */}
      <View style={styles.backgroundCurved} />

      {/* Содержимое вкладок (иконки и подписи) */}
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key] || {};
          const isFocused = state.index === index;

          let iconSource;
          let label = route.name;

          switch (route.name) {
            case 'TabMenu':
              iconSource = require('../assets/home.png');
              label = 'Menu';
              break;
            case 'Rating':
              iconSource = require('../assets/rating.png');
              label = 'Rating';
              break;
            case 'Challenges':
              iconSource = require('../assets/challanges.png');
              label = 'Challenge';
              break;
            case 'Profile':
              iconSource = require('../assets/profile.png');
              label = 'Profile';
              break;
            case 'Debt':
              iconSource = require('../assets/managment.png');
              label = 'Debt';
              break;
            default:
              iconSource = require('../assets/profile.png');
              label = route.name;
          }

          const boxBackgroundColor = isFocused ? ACTIVE_BG : INACTIVE_BG;
          const tintColor = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
          const textColor = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: boxBackgroundColor }]}>
                <Image
                  source={iconSource}
                  style={[styles.tabIcon, { tintColor }]}
                />
                 <Text style={[styles.tabLabel, { color: '#8B0A02' }]}>{label}</Text>
              </View>
             
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Абсолютно позиционированный контейнер, который будет располагаться внизу экрана
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // Красный закруглённый фон
  backgroundCurved: {
    // Заполняем весь контейнер
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TAB_BAR_BG,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  // Сами кнопки табов
  tabRow: {
    flexDirection: 'row',
    width: width,
    height: 75,
    // Прозрачный фон, чтобы был виден backgroundCurved
    backgroundColor: 'transparent',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  tabIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10,
  },
});
