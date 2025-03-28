import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';

const CreditRating = ({ navigation }) => {
  const [creditData, setCreditData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Поля формы
  const [creditScore, setCreditScore] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [creditStatus, setCreditStatus] = useState('');
  const [paymentHistory, setPaymentHistory] = useState('');
  const [otherCredits, setOtherCredits] = useState('');
  const [paymentHistory2, setPaymentHistory2] = useState('');
  const [creditGoals, setCreditGoals] = useState('');

  const screenMode = creditData ? 'view' : 'empty';

  const handleAddPress = () => {
    setCreditScore('');
    setTotalDebt('');
    setCreditStatus('');
    setPaymentHistory('');
    setOtherCredits('');
    setPaymentHistory2('');
    setCreditGoals('');
    setEditMode(true);
  };

  const handleEditPress = () => {
    if (creditData) {
      setCreditScore(creditData.creditScore);
      setTotalDebt(creditData.totalDebt);
      setCreditStatus(creditData.creditStatus);
      setPaymentHistory(creditData.paymentHistory);
      setOtherCredits(creditData.otherCredits);
      setPaymentHistory2(creditData.paymentHistory2);
      setCreditGoals(creditData.creditGoals);
      setEditMode(true);
    }
  };

  const handleSave = () => {
    if (!creditScore || !totalDebt) {
      Alert.alert('Error', 'Please fill credit score and total debt amount');
      return;
    }
    const newData = {
      creditScore,
      totalDebt,
      creditStatus,
      paymentHistory,
      otherCredits,
      paymentHistory2,
      creditGoals,
    };
    setCreditData(newData);
    setEditMode(false);
  };

  // -------- Экран формы (Add/Edit) --------
  if (editMode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftColumn}>
            <TouchableOpacity onPress={() => setEditMode(false)} style={styles.backButton}>
              <Image
                source={require('../assets/arrowLeft.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.headerTitle}>
              {creditData ? 'Edit Credit rating' : 'Add Credit rating'}
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <TouchableOpacity onPress={handleSave} style={styles.backButton}>
              <Image
                source={require('../assets/checkIcon.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
          <TextInput
            style={styles.formInput}
            placeholder="Current credit score"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={creditScore}
            onChangeText={setCreditScore}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Total debt amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={totalDebt}
            onChangeText={setTotalDebt}
          />

          {/* Credit status (3 кнопки) */}
          <Text style={styles.label}>Credit status</Text>
          <View style={styles.chipRow}>
            {['Active','Closed','None'].map((status) => {
              const isSelected = creditStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.chip3, isSelected && styles.chipSelected]}
                  onPress={() => setCreditStatus(status)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Payment history (2 кнопки) */}
          <Text style={styles.label}>Payment history</Text>
          <View style={styles.chipRow}>
            {['On-time','Missed'].map((item) => {
              const isSelected = paymentHistory === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip2, isSelected && styles.chipSelected]}
                  onPress={() => setPaymentHistory(item)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Additional Factors</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Other credits"
            placeholderTextColor="#aaa"
            value={otherCredits}
            onChangeText={setOtherCredits}
          />

          {/* Payment history2 (2 кнопки) */}
          <Text style={styles.label}>Payment history</Text>
          <View style={styles.chipRow}>
            {['Stable','Unstable'].map((item) => {
              const isSelected = paymentHistory2 === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip2, isSelected && styles.chipSelected]}
                  onPress={() => setPaymentHistory2(item)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={styles.formInput}
            placeholder="Credit rating goals"
            placeholderTextColor="#aaa"
            value={creditGoals}
            onChangeText={setCreditGoals}
          />
        </ScrollView>
      </View>
    );
  }

  // -------- Пустое состояние (нет данных) --------
  if (!creditData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftColumn}>
            
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.headerTitle}>Credit rating</Text>
          </View>
          <View style={styles.rightColumn} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.emptyContainer}>
            <View style={styles.cardEmpty}>
              <Image
                source={require('../assets/moneyBag.png')}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>There's nothing here yet..</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footerContainer2}>
          <TouchableOpacity style={styles.fullWidthButton} onPress={handleAddPress}>
            <Text style={styles.fullWidthButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // -------- Экран просмотра (view) --------
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftColumn} />
        <View style={styles.centerColumn}>
          <Text style={styles.headerTitle1}>Credit rating</Text>
        </View>
        <View style={styles.rightColumn}>
          <TouchableOpacity onPress={handleEditPress} style={styles.backButton}>
            <Image
              source={require('../assets/editIcon.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.bigCard}>
          <Image
            source={require('../assets/moneyBag.png')}
            style={styles.bigCardImage}
          />
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Current Credit Score</Text>
            <Text style={styles.rowValue}>{creditData.creditScore}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Credit Status</Text>
            <Text style={styles.rowValue}>
              {creditData.creditStatus || '—'}
            </Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Total Debt Amount</Text>
            <Text style={styles.rowValue}>${creditData.totalDebt}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Payment History</Text>
            <Text style={styles.rowValue}>
              {creditData.paymentHistory || '—'}
            </Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Other Credits</Text>
            <Text style={styles.rowValue}>
              {creditData.otherCredits || '—'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Recommendations for Improving Credit Score
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            • Payment Discipline: Always pay debts on time.
          </Text>
          <Text style={styles.cardText}>
            • Debt Reduction: Try to reduce total debt amount.
          </Text>
          <Text style={styles.cardText}>
            • Credit Diversity: Maintain a variety of credit products.
          </Text>
          <Text style={styles.cardText}>
            • Credit Card Usage: Use credit cards wisely.
          </Text>
          <Text style={styles.cardText}>
            • Credit Report Monitoring: Regularly check your credit report.
          </Text>
        </View>
        <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.fullWidthButton} onPress={handleAddPress}>
          <Text style={styles.fullWidthButtonText}>Add</Text>
        </TouchableOpacity>
      
      </View>
      </ScrollView>
     
    </View>
  );
};

export default CreditRating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B0000',
  },

  // Шапка
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    paddingTop: 71,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  leftColumn: {

    justifyContent: 'center',
  },
  centerColumn: {
    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightColumn: {
    
    alignItems: 'flex-end',
    justifyContent: 'center',
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

    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle1: {
left:20,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
      },

  // Пустое состояние
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmpty: {
    marginTop:-80,
    width:330,
    backgroundColor: '#852A2B',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
  },

  // Контент
  content: {
    flex: 1,
  },

  // Кнопка Add
  footerContainer: {
    bottom:10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#6B0000',
  },
  footerContainer2: {
    bottom:100,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#6B0000',
  },
  fullWidthButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fullWidthButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },

  // Форма
  formInput: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginHorizontal: 10,
   height:60,
    marginTop: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  label: {
    color: '#fff',
    marginLeft: 16,
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },

  chipRow: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 8,
    // по центру, растянуть на всю ширину
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  // Для ТРЁХ кнопок
  chip3: {
    backgroundColor: '#852A2B',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    // Убираем width, растягиваем через flex
    flex: 1,           // каждый чип занимает одинаково
    marginHorizontal: 6,
  },
  // Для ДВУХ кнопок
  chip2: {
    backgroundColor: '#852A2B',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
  },

  chipSelected: {
    backgroundColor: '#FFD700',
  },
  chipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#000',
  },

  // Просмотр
  bigCard: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  bigCardImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 16,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  rowLabel: {
    color: '#fff',
    fontSize: 16,
  },
  rowValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
  },
  cardText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 20,
  },
});
