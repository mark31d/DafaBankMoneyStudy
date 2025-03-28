import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

/**
 * Loader с одним логотипом, плавным появлением и исчезновением.
 *
 * @param {Object}   props
 * @param {number}   [props.duration=2000] - Время (мс), которое логотип будет оставаться видимым (не считая анимаций).
 * @param {Function} [props.onEnd]        - Колбэк, вызывается после полного исчезновения логотипа.
 */
const Loader = ({ duration = 2000, onEnd }) => {
  // Значение анимации для непрозрачности (0 = прозрачный, 1 = непрозрачный)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Запускаем последовательность: плавное появление -> ожидание -> плавное исчезновение
    Animated.sequence([
      // Появление (1 сек)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Задержка на экране (duration)
      Animated.delay(duration),
      // Исчезновение (1 сек)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // По завершении всей анимации вызываем onEnd
      if (onEnd) onEnd();
    });
  }, [fadeAnim, duration, onEnd]);

  return (
    <View style={styles.container}>
      {/* Логотип в центре */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('../assets/Logo.png')} // Замените на свой путь к картинке
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default Loader;

// ---------- Стили ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B0000', // Цвет фона, как на скриншоте
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    // Можно добавить отступы, если нужно
  },
  logo: {
    width: 400,  // Ширина логотипа
    height: 400, // Высота логотипа
  },
});
