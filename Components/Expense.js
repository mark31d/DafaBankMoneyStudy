// Expense.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';

const expenseCategories = [
  'Housing',
  'Food',
  'Transportation',
  'Healthcare',
  'Insurance',
  'Education',
  'Entertainment',
  'Clothing',
  'Beauty',
  'Debts',
  'Household',
  'Charity',
];

const Expense = ({ onBack, onSave }) => {
  // Состояние шага: 'category' или 'details'
  const [step, setStep] = useState('category');
  // Состояние выбранной категории
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Состояния для деталей транзакции (в режиме "details")
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  // Обработчик перехода со страницы выбора категории на страницу ввода деталей
  const handleCategoryNext = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    setStep('details');
  };

  // Обработчик сохранения на экране деталей
  const handleSave = () => {
    if (!year || !month || !day || !amount) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const finalDate = `${year}-${month}-${day}`;
    const newTx = {
      id: String(Date.now()),
      title: selectedCategory,
      description: desc,
      amount: `-${amount}`,
      time: time || '00:00',
      type: 'expense',
      date: finalDate,
    };
    onSave(newTx);
  };

  // Унифицированный Header для обоих шагов
  const Header = ({ onSavePress }) => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          if (step === 'details') {
            // При возврате с экрана деталей переходим обратно на выбор категории
            setStep('category');
          } else {
            onBack();
          }
        }}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Expense</Text>
      <TouchableOpacity onPress={onSavePress} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>✓</Text>
      </TouchableOpacity>
    </View>
  );

  if (step === 'category') {
    // Экран выбора категории
    return (
      <View style={styles.container}>
        <Header onSavePress={handleCategoryNext} />
        <Text style={styles.categoryLabel}>Select Category</Text>
        <ScrollView contentContainerStyle={styles.categoryListContainer}>
          {expenseCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  isSelected && styles.categoryItemSelected
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // Экран ввода деталей (step === 'details')
  return (
    <View style={styles.container}>
      <Header onSavePress={handleSave} />
      <View style={styles.formContainer}>
        <Text style={styles.selectedCategoryText}>
          Category: {selectedCategory}
        </Text>
        {/* Контейнер для ввода даты, разделённый на три поля */}
        <View style={styles.dateContainer}>
          <TextInput
            style={[styles.formInput, styles.dateInput]}
            placeholder="Year (YYYY)"
            placeholderTextColor="#aaa"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.formInput, styles.dateInput]}
            placeholder="Month (MM)"
            placeholderTextColor="#aaa"
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.formInput, styles.dateInput]}
            placeholder="Day (DD)"
            placeholderTextColor="#aaa"
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
          />
        </View>
        <TextInput
          style={styles.formInput}
          placeholder="Time (HH:MM)"
          placeholderTextColor="#aaa"
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Description"
          placeholderTextColor="#aaa"
          value={desc}
          onChangeText={setDesc}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Amount"
          placeholderTextColor="#aaa"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

export default Expense;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#6B0000' 
  },
  // Шапка
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backButtonText: { 
    color: '#000', 
    fontSize: 16 
  },
  headerTitle: { 
    fontSize: 18, 
    color: '#fff', 
    fontWeight: '600' 
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  saveButtonText: { 
    color: '#000', 
    fontSize: 16 
  },

  // Режим выбора категории
  categoryLabel: { 
    color: '#fff', 
    marginLeft: 16, 
    marginTop: 10, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  categoryListContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100,
  },
  categoryItem: {
    backgroundColor: '#8B0A02',
    padding: 14,
    marginVertical: 6,
    borderRadius: 8,
  },
  categoryItemSelected: {
    backgroundColor: '#FFD700',
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#000',
  },

  // Режим ввода деталей
  formContainer: { 
    padding: 16 
  },
  selectedCategoryText: { 
    color: '#fff', 
    fontSize: 16, 
    marginBottom: 10 
  },
  // Контейнер для даты
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 4,
  },
  formInput: {
    backgroundColor: '#8B0A02',
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
    color: '#fff',
    fontSize: 16,
  },
});
