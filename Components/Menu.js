import React, { useState,  useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Modal
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Income from './Income';
import Expense from './Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Все 12 месяцев:
const monthsList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Пример данных по транзакциям
const initialTransactions = {
  January: [
    {
      id: '1',
      title: 'Salary',
      description: 'January Salary',
      amount: '+3000',
      time: '10:00 AM',
      type: 'income',
      date: '2023-01-15',
    },
    {
      id: '2',
      title: 'Restaurant',
      description: 'Dinner',
      amount: '-50',
      time: '19:00 PM',
      type: 'expense',
      date: '2023-01-16',
    },
  ],
  February: [
    {
      id: '3',
      title: 'Salary',
      description: 'February Salary',
      amount: '+3500',
      time: '10:00 AM',
      type: 'income',
      date: '2023-02-15',
    },
    {
      id: '4',
      title: 'Groceries',
      description: 'Weekly shopping',
      amount: '-200',
      time: '18:00 PM',
      type: 'expense',
      date: '2023-02-17',
    },
    {
      id: '5',
      title: 'Gas',
      description: 'Fuel for car',
      amount: '-50',
      time: '20:00 PM',
      type: 'expense',
      date: '2023-02-18',
    },
  ],
  October: [
    {
      id: '6',
      title: 'Bonus',
      description: 'Project bonus',
      amount: '+2000',
      time: '09:00 AM',
      type: 'income',
      date: '2023-10-05',
    },
    {
      id: '7',
      title: 'Clothes',
      description: 'New shoes',
      amount: '-120',
      time: '17:00 PM',
      type: 'expense',
      date: '2023-10-10',
    },
    {
      id: '8',
      title: 'Internet Bill',
      description: 'Monthly charge',
      amount: '-30',
      time: '12:00 PM',
      type: 'expense',
      date: '2023-10-12',
    },
  ],
};


function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}


function buildChartData(transactions, activeTab) {
  if (!transactions.length) return null;

  const aggregator = {};
  const monthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  transactions.forEach(tx => {
    if (!tx.date) return;
    const dateObj = new Date(tx.date);
    let key;

    switch(activeTab) {
      case 'Today':
        key = tx.time || '00:00';
        break;
      case 'Week':
        key = `Week ${getWeekNumber(dateObj)}`;
        break;
      case 'Month':
        key = monthsShort[dateObj.getMonth()];
        break;
      case 'Year':
        key = String(dateObj.getFullYear());
        break;
      default:
        key = tx.date;
    }

    aggregator[key] = (aggregator[key] || 0) + parseFloat(tx.amount);
  });

  const keys = Object.keys(aggregator);
  const sortedKeys = keys.sort((a, b) => {
    if (activeTab === 'Today') {
      const [h1, m1] = a.split(':').map(Number);
      const [h2, m2] = b.split(':').map(Number);
      return h1*60 + m1 - (h2*60 + m2);
    }
    if (activeTab === 'Week') {
      return Number(a.replace('Week ', '')) - Number(b.replace('Week ', ''));
    }
    if (activeTab === 'Month') {
      return monthsShort.indexOf(a) - monthsShort.indexOf(b);
    }
    if (activeTab === 'Year') {
      return Number(a) - Number(b);
    }
    return a.localeCompare(b);
  });

  return {
    labels: sortedKeys,
    datasets: [{ data: sortedKeys.map(k => aggregator[k]), strokeWidth: 4 }]
  };
}

const Menu = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [allTransactions, setAllTransactions] = useState(initialTransactions);
  const dataForMonth = allTransactions[selectedMonth] || [];

  const [activeTab, setActiveTab] = useState('Today');
  const [filter, setFilter] = useState('all');
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [screenMode, setScreenMode] = useState('main');
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('profilePhoto')
        .then(uri => {
          if (uri) setProfilePhoto(uri);
        })
        .catch(error => console.error('Error loading profile photo:', error));
    }, [])
  );


  const saveTransactionsToStorage = async (transactions) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const handleDelete = (id) => {
    const updated = dataForMonth.filter(tx => tx.id !== id);
    const newAll = { ...allTransactions, [selectedMonth]: updated };
    setAllTransactions(newAll);
    saveTransactionsToStorage(newAll);
  };

  // Добавляем переход на экран Bills and Payments
  
  // Переход на Income / Expense
  if (screenMode === 'income') {
    return (
      <Income
        onBack={() => setScreenMode('main')}
        onSave={(tx) => {
          const updatedTx = [...dataForMonth, tx];
          const newAll = { ...allTransactions, [selectedMonth]: updatedTx };
          setAllTransactions(newAll);
          saveTransactionsToStorage(newAll);
          setScreenMode('main');
        }}
      />
    );
  }
  if (screenMode === 'expense') {
    return (
      <Expense
        onBack={() => setScreenMode('main')}
        onSave={(tx) => {
          const updatedTx = [...dataForMonth, tx];
          const newAll = { ...allTransactions, [selectedMonth]: updatedTx };
          setAllTransactions(newAll);
          saveTransactionsToStorage(newAll);
          setScreenMode('main');
        }}
      />
    );
  }

  const displayedTx = dataForMonth.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const chartData = buildChartData(displayedTx, activeTab);

  const chartConfig = {
    backgroundColor: '#6B0000',
    backgroundGradientFrom: '#6B0000',
    backgroundGradientTo: '#6B0000',
    decimalPlaces: 0,
    color: (opacity) => `rgba(255,215,0,${opacity})`,
    labelColor: (opacity) => `rgba(255,255,255,${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#FFD700' },
  };

  const handleMonthPress = () => setShowMonthModal(true);
  const arrowImage = showMonthModal
    ? require('../assets/arrowUp.png')
    : require('../assets/arrowDown.png');

  const handleTabPress = (tab) => setActiveTab(tab);
  const handleIncomeFilter = () => setFilter(filter === 'income' ? 'all' : 'income');
  const handleExpenseFilter = () => setFilter(filter === 'expense' ? 'all' : 'expense');

  // Заголовок списка, включающий ссылки
  const renderListHeader = () => (
    <View>
      {/* Секция ссылок */}
      <View style={styles.sectionLinks}>
        {/* Переход на Bills and Payments */}
        <TouchableOpacity
  style={styles.linkRow}
  onPress={() => navigation.navigate('BillsAndPayments')}
>
  <Text style={styles.sectionLinkText}>Upcoming Bills and Payments</Text>
  <Image source={require('../assets/arrowRight.png')} style={styles.linkArrow} />
</TouchableOpacity>
        <TouchableOpacity style={styles.linkRow}  onPress={() => navigation.navigate('Recommendations')}>
          <Text style={styles.sectionLinkText}>Recommendations</Text>
          <Image source={require('../assets/arrowRight.png')} style={styles.linkArrow} />
        </TouchableOpacity>
      </View>

      {/* Табы */}
      <View style={styles.tabsContainer}>
        {['Today', 'Week', 'Month', 'Year'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => handleTabPress(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* График */}
      {chartData ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>No data yet</Text>
      )}

      {/* Кнопки Income / Expense */}
      <View style={styles.bigButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.bigButton,
            { backgroundColor: '#00A86B' },
            filter === 'income' && styles.activeBorder,
          ]}
          onPress={handleIncomeFilter}
        >
          <View style={styles.iconCircle}>
            <Image source={require('../assets/incomeIcon.png')} style={styles.bigButtonIcon} />
          </View>
          <View>
            <Text style={styles.bigButtonTitle}>Income</Text>
            <Text style={styles.bigButtonAmount}>
              $
              {dataForMonth
                .filter((tx) => tx.type === 'income')
                .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0)
                .toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bigButton,
            { backgroundColor: '#FD3C4A' },
            filter === 'expense' && styles.activeBorder,
          ]}
          onPress={handleExpenseFilter}
        >
          <View style={styles.iconCircle}>
            <Image source={require('../assets/expenseIcon.png')} style={styles.bigButtonIcon} />
          </View>
          <View>
            <Text style={styles.bigButtonTitle}>Expense</Text>
            <Text style={styles.bigButtonAmount}>
              $
              {dataForMonth
                .filter((tx) => tx.type === 'expense')
                .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0)
                .toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Верхняя шапка */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.leftColumn}>
          <Image source={profilePhoto ? { uri: profilePhoto } : require('../assets/profile.png')} style={styles.avatar} />
          </View>
          <View style={styles.centerColumn}>
            <TouchableOpacity style={styles.monthSelector} onPress={handleMonthPress}>
              <Text style={styles.monthText}>{selectedMonth}</Text>
              <Image source={arrowImage} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.rightColumn} />
        </View>
      </View>

      {/* Модальное окно выбора месяца */}
      <Modal
        visible={showMonthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowMonthModal(false)}
        >
          <View style={styles.modalContent}>
            {monthsList.map((month) => (
              <TouchableOpacity
                key={month}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedMonth(month);
                  setShowMonthModal(false);
                  setFilter('all');
                }}
              >
                <Text style={styles.modalItemText}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Основной список транзакций */}
      <SwipeListView
        data={displayedTx}
        keyExtractor={(item) => item.id}
        rightOpenValue={-75}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={() => (
          <View style={{ paddingVertical: 30, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => setShowActionButtons(!showActionButtons)}
            >
              <Image
                source={
                  showActionButtons
                    ? require('../assets/close.png')
                    : require('../assets/add.png')
                }
                style={styles.plusButtonText}
              />
            </TouchableOpacity>
            {showActionButtons && (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
                  onPress={() => setScreenMode('income')}
                >
                  <Image source={require('../assets/incomeIcon.png')} style={styles.actionButtonIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
                  onPress={() => setScreenMode('expense')}
                >
                  <Image source={require('../assets/expenseIcon.png')} style={styles.actionButtonIcon} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDescription}>{item.description}</Text>
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.transactionAmount,
                  item.type === 'income' ? styles.amountIncome : styles.amountExpense,
                ]}
              >
                {item.amount}
              </Text>
              <Text style={styles.transactionTime}>
                {item.date} {item.time}
              </Text>
            </View>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Image source={require('../assets/trash.png')} style={styles.deleteIcon} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

export default Menu;
const styles = StyleSheet.create({
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    left:270,
    top:-20,
    height: 100,
    
  },
  deleteIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: '#6B0000',
  
  },

  // Верхняя шапка
  headerContainer: {
    backgroundColor: '#000',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 10,
    paddingTop: 60, // отступ от верхней границы экрана
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // Больше не используем justifyContent: 'space-between',
    // так как делаем три колонки.
  },

  // Три колонки в шапке
  leftColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerColumn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  monthText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 6,
    tintColor: '#fff',
  },

  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 150,
  },

  // Ссылки (Upcoming Bills / Recommendations)
  sectionLinks: {
    backgroundColor: '#6B0000',
    marginVertical: 10,
  },
  linkRow: {
    paddingHorizontal:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sectionLinkText: {
    color: '#fff',
    fontSize: 16,
  },
  linkArrow: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },

  // Табы
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#61120B', // Тёмно-красный цвет (можно поменять на нужный)
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    padding: 2,               // Небольшие отступы внутри
    borderWidth: 1,           // Белая рамка
    borderColor: '#fff',
  },
  tabButton: {
    flex: 1,                  // Чтобы каждая вкладка занимала равное пространство
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,         // Повторяем радиус, чтобы при активном состоянии было плавное закругление
  },
  activeTabButton: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#61120B',         // Активная вкладка: тёмно-красный текст
    fontWeight: '600',
  },

  // График
  chartContainer: {
    backgroundColor: '#6B0000',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },

  // Кнопки Income/Expense
  bigButtonsContainer: {
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom:10,
  },
  bigButton: {
    
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: (width - 30) / 2,
  },
  activeBorder: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bigButtonIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  bigButtonTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bigButtonAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // Список транзакций
  listContentContainer: {
   
    padding:10,
    marginTop: 10,
    
  },
  transactionItem: {
    
    backgroundColor: '#852A2B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDescription: {
    color: '#ffcfcf',
    fontSize: 12,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountIncome: {
    color: '#00ff7f',
  },
  amountExpense: {
    color: '#ff7f7f',
  },
  transactionTime: {
    color: '#ffcfcf',
    fontSize: 12,
    marginTop: 2,
  },

  // Кнопки Add Income / Add Expense (по нажатию на +)
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -190,
    marginBottom:140,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },

  // Кнопка +
  plusButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:80,
    marginTop:20,
  },
  plusButtonText: {
    width: 30,
    height: 30,
    color: '#FFFFFF',
    
  },

  // Модальное окно выбора месяца
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
