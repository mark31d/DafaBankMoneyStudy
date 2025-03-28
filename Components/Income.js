// Income.js (двухшаговый компонент)
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';

// Массив доступных категорий
const categories = ['Salary', 'Gift', 'Percentages'];

const Income = ({ onBack, onSave }) => {
  // Управляем текущим "шагом": 'category' или 'details'
  const [step, setStep] = useState('category');

  // Состояния для выбора категории
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Состояния для деталей транзакции
  // Вместо одного поля для даты теперь три поля
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  // Нажатие на галочку на первом "экране" (выбор категории)
  const handleCategorySave = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    // Переходим к шагу "details"
    setStep('details');
  };

  // Нажатие на галочку на втором "экране" (ввод деталей)
  const handleDetailsSave = () => {
    if (!year || !month || !day || !amount) {
      Alert.alert('Error', 'Please fill Year, Month, Day and Amount');
      return;
    }
    // Формируем дату в формате YYYY-MM-DD
    const finalDate = `${year}-${month}-${day}`;

    // Собираем объект транзакции
    const newTx = {
        id: String(Date.now()),
        title: selectedCategory, // добавлено поле title
        type: 'income',
        category: selectedCategory,
        date: finalDate,
        time: time || '00:00',
        description,
        amount: `+${amount}`,
      };
    // Вызываем колбэк, передавая данные наверх
    onSave(newTx);
  };

  // Первый "экран": выбор категории
  if (step === 'category') {
    return (
      <View style={styles.container}>
        {/* Шапка */}
        <View style={styles.header}>
          {/* Кнопка "Назад" */}
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Заголовок */}
          <Text style={styles.headerTitle}>Income</Text>

          {/* Галочка (сохраняем и переходим к деталям) */}
          <TouchableOpacity onPress={handleCategorySave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>✓</Text>
          </TouchableOpacity>
        </View>

        {/* Содержимое: список категорий */}
        <View style={styles.content}>
          <Text style={styles.label}>Categories</Text>
          {categories.map((cat) => {
            const isSelected = cat === selectedCategory;
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
        </View>
      </View>
    );
  }

  // Второй "экран": ввод деталей транзакции
  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        {/* Кнопка "Назад" (возвращает к шагу "category") */}
        <TouchableOpacity onPress={() => setStep('category')} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Заголовок */}
        <Text style={styles.headerTitle}>Income</Text>

        {/* Галочка (сохраняем и передаём данные наверх) */}
        <TouchableOpacity onPress={handleDetailsSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>✓</Text>
        </TouchableOpacity>
      </View>

      {/* Поля ввода: Год, Месяц, День, Time, Description, Amount */}
      <View style={styles.formContainer}>
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
          value={description}
          onChangeText={setDescription}
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

export default Income;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B0000',
  },
  // Чёрная шапка
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
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
  },

  // Первый "экран": выбор категории
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryItem: {
    backgroundColor: '#7C130C',
    borderRadius: 8,
    paddingVertical: 14,
    marginVertical: 6,
    paddingHorizontal: 16,
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

  // Второй "экран": ввод деталей
  formContainer: {
    padding: 16,
  },
  // Группа для даты (год, месяц, день)
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
