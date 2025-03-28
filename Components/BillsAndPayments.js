import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Alert,
  Modal,
  AsyncStorage  // или '@react-native-async-storage/async-storage' в зависимости от версии
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Calendar } from 'react-native-calendars';

// Упрощённый выбор времени
const TimePickerUI = ({ currentTime, onCancel, onConfirm }) => {
  const [hours, setHours] = useState(() => {
    const hh = parseInt(currentTime.split(':')[0] || '0', 10);
    return isNaN(hh) ? 0 : hh;
  });
  const [minutes, setMinutes] = useState(() => {
    const mm = parseInt(currentTime.split(':')[1] || '0', 10);
    return isNaN(mm) ? 0 : mm;
  });

  return (
    <View style={styles.timePickerContainer}>
      <Text style={styles.timePickerLabel}>Select Time</Text>
      <View style={styles.timeRow}>
        <Text style={{ color: '#fff', marginRight: 4 }}>Hours:</Text>
        <TextInput
          style={styles.timeInput}
          keyboardType="numeric"
          value={String(hours)}
          onChangeText={(val) => setHours(parseInt(val || '0', 10))}
        />
      </View>
      <View style={styles.timeRow}>
        <Text style={{ color: '#fff', marginRight: 4 }}>Minutes:</Text>
        <TextInput
          style={styles.timeInput}
          keyboardType="numeric"
          value={String(minutes)}
          onChangeText={(val) => setMinutes(parseInt(val || '0', 10))}
        />
      </View>

      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <TouchableOpacity style={styles.timeButton} onPress={onCancel}>
          <Text style={styles.timeButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeButton, { marginLeft: 16 }]}
          onPress={() => {
            // Валидация диапазонов
            const hh = Math.max(0, Math.min(23, hours));
            const mm = Math.max(0, Math.min(59, minutes));
            onConfirm(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
          }}
        >
          <Text style={styles.timeButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BillsAndPayments = ({ navigation }) => {
  // Изначально пустой список (чтобы подождать загрузки из AsyncStorage)
  const [bills, setBills] = useState([]);
  const [screenMode, setScreenMode] = useState('list');

  const [currentBill, setCurrentBill] = useState({
    id: '',
    title: '',
    amount: '',
    date: '',
    description: '',
    notificationsEnabled: false,
    notificationDate: '',
    notificationTime: '',
  });

  // Управляем общей модалкой (календарь / выбор времени)
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [isTimeMode, setIsTimeMode] = useState(false); // false = календарь, true = время

  // === Загрузка / Сохранение через AsyncStorage ===
  const STORAGE_KEY = 'myBillsData';

  // Загружаем при монтировании
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Сохраняем при любом изменении массива bills
  useEffect(() => {
    saveToStorage(bills);
  }, [bills]);

  const loadFromStorage = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        setBills(JSON.parse(json));
      }
    } catch (err) {
      console.log('Error loading from storage:', err);
    }
  };

  const saveToStorage = async (list) => {
    try {
      const json = JSON.stringify(list);
      await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (err) {
      console.log('Error saving to storage:', err);
    }
  };
  // === конец блока AsyncStorage ===

  // Удаление
  const handleDelete = (id) => {
    const updated = bills.filter((b) => b.id !== id);
    setBills(updated);
  };

  // Добавление (переход в режим редактирования)
  const handleAddPress = () => {
    setCurrentBill({
      id: '',
      title: '',
      amount: '',
      date: '',
      description: '',
      notificationsEnabled: false,
      notificationDate: '',
      notificationTime: '',
    });
    setScreenMode('edit');
  };

  // Редактирование
  const handleEditPress = (item) => {
    setCurrentBill(item);
    setScreenMode('edit');
  };

  // Сохранение (добавление/обновление)
  const handleSave = () => {
    if (!currentBill.title || !currentBill.amount || !currentBill.date) {
      Alert.alert('Error', 'Please fill Title, Amount and Date at least');
      return;
    }
    if (!currentBill.id) {
      const newBill = { ...currentBill, id: String(Date.now()) };
      setBills([...bills, newBill]);
    } else {
      const updated = bills.map((b) => (b.id === currentBill.id ? currentBill : b));
      setBills(updated);
    }
    setScreenMode('list');
  };

  // Кнопка "Назад" из редактирования
  const handleBackFromEdit = () => {
    setScreenMode('list');
  };

  // === РЕНДЕР СПИСКА ===
  if (screenMode === 'list') {
    const isEmpty = bills.length === 0;
    return (
      <View style={styles.container}>
        {/* Шапка */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/arrowLeft.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bills and Payments</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Пустое состояние */}
        {isEmpty ? (
          <View style={styles.emptyContainer}>
             <View style={styles.emptycontr}>
            <Image source={require('../assets/moneyBag.png')} style={styles.emptyImage} />
            <Text style={styles.emptyText}>There's nothing here yet...</Text>
            </View>
            <View style={styles.bottomAddContainer}>
              <TouchableOpacity style={styles.fullWidthAddButton} onPress={handleAddPress}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <SwipeListView
              data={bills}
              keyExtractor={(item) => item.id}
              rightOpenValue={-70}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.billItem}
                  onPress={() => handleEditPress(item)}
                >
                  <Text style={styles.billTitle}>{item.title}</Text>
                  <Text style={styles.billDate}>{item.date}</Text>
                  <Text style={styles.billDescription}>{item.description}</Text>
                  <Text style={styles.billAmount}>${item.amount}</Text>
                </TouchableOpacity>
              )}
              renderHiddenItem={({ item }) => (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Image source={require('../assets/trash.png')} style={styles.deleteIcon} />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContentContainer}
            />

            {/* Кнопка Add внизу */}
            <View style={styles.bottomAddContainer}>
              <TouchableOpacity style={styles.fullWidthAddButton} onPress={handleAddPress}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  // === РЕНДЕР ЭКРАНА РЕДАКТИРОВАНИЯ ===
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackFromEdit} style={styles.backButton}>
          <Image source={require('../assets/arrowLeft.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bills and Payments</Text>
        <TouchableOpacity onPress={handleSave} style={styles.backButton}>
          <Image source={require('../assets/checkIcon.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.formInput}
          placeholder="Title"
          placeholderTextColor="#aaa"
          value={currentBill.title}
          onChangeText={(val) => setCurrentBill({ ...currentBill, title: val })}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Amount"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={currentBill.amount}
          onChangeText={(val) => setCurrentBill({ ...currentBill, amount: val })}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Date (e.g. 15.01.2025)"
          placeholderTextColor="#aaa"
          value={currentBill.date}
          onChangeText={(val) => setCurrentBill({ ...currentBill, date: val })}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Description"
          placeholderTextColor="#aaa"
          value={currentBill.description}
          onChangeText={(val) => setCurrentBill({ ...currentBill, description: val })}
        />

        <View style={styles.notificationRow}>
          <Text style={styles.notificationLabel}>Notifications</Text>
          <Switch
            value={currentBill.notificationsEnabled}
            onValueChange={(val) => setCurrentBill({ ...currentBill, notificationsEnabled: val })}
            trackColor={{ false: '#767577', true: '#FFD700' }}
            thumbColor={currentBill.notificationsEnabled ? '#000' : '#f4f3f4'}
          />
        </View>

        {currentBill.notificationsEnabled && (
          <View style={{ marginVertical: 10 }}>
            <Text style={{ color: '#fff', marginBottom: 5, fontSize: 16 }}>
              Select the notification date
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowDateTimeModal(true);
                setIsTimeMode(false);
              }}
            >
              <Text style={{ color: '#FFD700', fontSize: 16, fontWeight: '600' }}>
                {currentBill.notificationDate ? 'Edit' : 'Choose'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentBill.notificationsEnabled && currentBill.notificationDate ? (
          <View style={styles.chosenDateRow}>
            <Text style={styles.chosenDateText}>
              {currentBill.notificationDate} {currentBill.notificationTime}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setCurrentBill({ ...currentBill, notificationDate: '', notificationTime: '' })
              }
            >
              <Text style={styles.editText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Модалка (календарь / выбор времени) */}
      <Modal visible={showDateTimeModal} transparent animationType="fade">
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContent}>
            {!isTimeMode && (
              <>
                <Text style={styles.calendarModalTitle}>Select Date</Text>
                <Calendar
                  monthFormat="MMMM yyyy"
                  onPressArrowLeft={(subtractMonth) => subtractMonth()}
                  onPressArrowRight={(addMonth) => addMonth()}
                  onDayPress={(day) => {
                    const d = String(day.day).padStart(2, '0');
                    const m = String(day.month).padStart(2, '0');
                    const y = String(day.year);
                    setCurrentBill((prev) => ({
                      ...prev,
                      notificationDate: `${d}.${m}.${y}`,
                    }));
                  }}
                  theme={{
                    calendarBackground: '#7C130C',
                    textSectionTitleColor: '#fff',
                    monthTextColor: '#fff',
                    dayTextColor: '#fff',
                    todayTextColor: '#FFD700',
                    arrowColor: '#FFD700',
                    selectedDayBackgroundColor: '#FFD700',
                    selectedDayTextColor: '#000',
                  }}
                  markedDates={{
                    [currentBill.notificationDate && formatForMarkedDate(currentBill.notificationDate)]: {
                      selected: true,
                      selectedColor: '#FFD700',
                      selectedTextColor: '#000',
                    },
                  }}
                />

                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Time</Text>
                  <TouchableOpacity onPress={() => setIsTimeMode(true)}>
                    <Text style={styles.timeValue}>
                      {currentBill.notificationTime || '00:00'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.closeCalendarButton}
                  onPress={() => setShowDateTimeModal(false)}
                >
                  <Text style={styles.closeCalendarButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}

            {isTimeMode && (
              <TimePickerUI
                currentTime={currentBill.notificationTime || '00:00'}
                onCancel={() => setIsTimeMode(false)}
                onConfirm={(newTime) => {
                  setCurrentBill((prev) => ({
                    ...prev,
                    notificationTime: newTime,
                  }));
                  setIsTimeMode(false);
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Вспомогательная функция для Calendar.markedDates
function formatForMarkedDate(ddmmyyyy) {
  if (!ddmmyyyy) return '';
  const [dd, mm, yyyy] = ddmmyyyy.split('.');
  return `${yyyy}-${mm}-${dd}`;
}

export default BillsAndPayments;



const styles = StyleSheet.create({
    emptycontr:{
        alignContent:'center',
        alignItems:'center',
        backgroundColor: '#852A2B',
        padding:45,
        marginBottom:15,
        borderRadius:15,
    },
  container: {
    flex: 1,
    backgroundColor: '#6B0000',
  },
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 16,
  },
  backButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 8,
  },
  backIcon: {
    width: 16,
    height: 16,
    tintColor: '#000',
    resizeMode: 'contain',
  },
  headerTitle: {
    left: 10,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
   
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    resizeMode: 'contain',
    
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    fontWeight:'bold',
    marginBottom: 16,
  },
  bottomAddContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    width: '100%',
  },
  fullWidthAddButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  listContentContainer: {
    paddingBottom: 80,
  },
  billItem: {
    backgroundColor: '#852A2B',
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 12,
    padding: 30,
  },
  billTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
    fontWeight: '600',
  },
  billDate: {
    color: '#FFD700',
    marginBottom: 4,
  },
  billDescription: {
    color: '#fff',
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    left: 270,
    top: 30,
    height: 100,
  },
  deleteIcon: {
    width: 35,
    height: 35,
    tintColor: '#FD3C4A',
    resizeMode: 'contain',
  },
  formContainer: {
    padding: 16,
  },
  formInput: {
    backgroundColor: '#852A2B',
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
    color: '#fff',
    fontSize: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  notificationLabel: {
    color: '#fff',
    fontSize: 16,
  },
  chosenDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chosenDateText: {
    color: '#fff',
    fontSize: 16,
  },
  editText: {
    color: '#FFD700',
    fontWeight: '600',
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContent: {
    width: '85%',
    backgroundColor: '#7C130C',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  calendarModalTitle: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 12,
    fontWeight: '700',
  },
  timeContainer: {
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  timeLabel: {
    color: '#fff',
    fontSize: 16,
  },
  timeValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  closeCalendarButton: {
    marginTop: 16,
  },
  closeCalendarButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  // ---- Стили для TimePickerUI ----
  timePickerContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  timePickerLabel: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    width: 60,
    height: 40,
    backgroundColor: '#852A2B',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginLeft: 4,
  },
  timeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  timeButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});
