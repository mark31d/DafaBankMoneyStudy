import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

// Пример: передадим navigation для возможности goBack
const Recommendations = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require('../assets/arrowLeft.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommendations</Text>
        {/* Пустая вью (для выравнивания) */}
        <View style={{ width: 40 }} />
      </View>

      {/* Прокручиваемая зона */}
      <ScrollView style={styles.content}>
        {/* Блок 1 */}
        <Text style={styles.sectionTitle}>
          Recommendations for Reducing Expenses
          {'\n'}and Increasing Savings
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            • Create a budget and track your expenses to identify areas where you can cut back.
          </Text>
          <Text style={styles.cardText}>
            • Reduce discretionary spending such as dining out and entertainment.
          </Text>
          <Text style={styles.cardText}>
            • Consider negotiating bills for services like cable, internet, and phone to lower monthly expenses.
          </Text>
          <Text style={styles.cardText}>
            • Look for ways to save on groceries by meal planning and using coupons.
          </Text>
          <Text style={styles.cardText}>
            • Automate savings by setting up automatic transfers to a savings account each month.
          </Text>
        </View>

        {/* Блок 2 */}
        <Text style={styles.sectionTitle}>
          Tips for Choosing Suitable Financial Products
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            • Savings Accounts: Compare interest rates and fees to find a high-yield savings account.
          </Text>
          <Text style={styles.cardText}>
            • Investments: Research different investment options based on your risk tolerance and financial goals.
          </Text>
          <Text style={styles.cardText}>
            • Insurance: Assess your insurance needs and compare policies to find the right coverage at the best price.
          </Text>
          <Text style={styles.cardText}>
            • Credit Cards: Look for cards with low interest rates and rewards programs that align with your spending habits.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Recommendations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B0000', // общий фон
  },
  // Шапка
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,  // отступ сверху (статус-бар)
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 8,
  },
  backIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Основная зона
  content: {
    flex: 1,
    padding: 16,
  },

  // Заголовок секции
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },

  // Карточка (фон)
  card: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 20,
  },
});
