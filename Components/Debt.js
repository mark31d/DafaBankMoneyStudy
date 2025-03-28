import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';

const Debt = () => {
  // Список всех долгов
  const [debts, setDebts] = useState([]);

  // Текущий таб: 'unpaid' или 'paid'
  const [activeTab, setActiveTab] = useState('unpaid');

  /**
   * screenMode:
   *  'list'         - список долгов (Unpaid / Paid) c разворачивающимися карточками и удалением
   *  'record'       - Debt Record (ID, Title, Amount, Date, Status) - шаг 1
   *  'participants' - Debt Participants (добавление/редактирование участников) - шаг 2
   */
  const [screenMode, setScreenMode] = useState('list');

  // Текущий (создаваемый/редактируемый) долг
  const [currentDebt, setCurrentDebt] = useState(null);

  // Поля для добавления участника (используются в screenMode === 'participants')
  const [tempPartId, setTempPartId] = useState('');
  const [tempPartName, setTempPartName] = useState('');
  const [tempPartSurname, setTempPartSurname] = useState('');
  const [tempPartRole, setTempPartRole] = useState('');
  const [tempPartAmount, setTempPartAmount] = useState('');

  // Храним, какие долги развернуты (ID => true/false)
  const [expanded, setExpanded] = useState({});

  // Фильтр долгов по статусу
  const filteredDebts = debts.filter((d) => d.status === activeTab);
  const isEmpty = filteredDebts.length === 0;

  // ======================= СПИСОК (screenMode === 'list') =======================

  // Кнопка "Add" в списке → создаём новый долг
  const handleAddPress = () => {
    setCurrentDebt({
      id: '',
      title: '',
      amount: '',
      startDate: '',
      endDate: '',
      status: 'unpaid',
      participants: [],
    });
    setScreenMode('record');
  };

  // Нажатие на карточку долга → редактируем существующий
  const handleEditDebt = (debt) => {
    setCurrentDebt({ ...debt });
    setScreenMode('record');
  };

  // Тоггл разворачивания
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Удаление долга
  const handleRemoveDebt = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this debt?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          setDebts((prev) => prev.filter((d) => d.id !== id));
        },
      },
    ]);
  };

  // ======================= DEBT RECORD (screenMode === 'record') =======================
  // «назад» → возвращаемся в список без сохранения
  const handleGoBackFromRecord = () => {
    setScreenMode('list');
    setCurrentDebt(null);
  };

  // «галочка» в Debt Record → переходим к экрану участников
  const handleNextToParticipants = () => {
    if (!currentDebt.title || !currentDebt.amount) {
      Alert.alert('Error', 'Please fill Title and Amount at least');
      return;
    }
    setScreenMode('participants');
    resetParticipantFields();
  };

  // ======================= DEBT PARTICIPANTS (screenMode === 'participants') =======================
  // «назад» → возвращаемся к Debt Record
  const handleBackFromParticipants = () => {
    setScreenMode('record');
  };

  // «галочка» в Debt Participants → окончательно сохраняем, возвращаемся в список
  const handleSaveAll = () => {
    // Генерируем ID, если нет
    const finalId = currentDebt.id || String(Date.now());
    const newDebt = { ...currentDebt, id: finalId };

    // Проверяем, есть ли уже запись
    const idx = debts.findIndex((d) => d.id === finalId);
    if (idx >= 0) {
      // обновляем
      const updated = [...debts];
      updated[idx] = newDebt;
      setDebts(updated);
    } else {
      // добавляем
      setDebts((prev) => [...prev, newDebt]);
    }
    // Возвращаемся в список
    setScreenMode('list');
    setCurrentDebt(null);
  };

  // Добавление участника
  const handleAddParticipant = () => {
    if (!tempPartId || !tempPartName || !tempPartAmount) {
      Alert.alert('Error', 'Please fill at least ID, Name, and Amount');
      return;
    }
    const newPart = {
      id: tempPartId,
      name: tempPartName,
      surname: tempPartSurname,
      role: tempPartRole,
      amount: tempPartAmount,
    };
    const updatedParts = [...currentDebt.participants, newPart];
    setCurrentDebt({ ...currentDebt, participants: updatedParts });
    resetParticipantFields();
  };

  // Удаление участника по индексу
  const handleRemoveParticipant = (index) => {
    if (!currentDebt) return;
    const updated = [...currentDebt.participants];
    updated.splice(index, 1);
    setCurrentDebt({ ...currentDebt, participants: updated });
  };

  // Сброс полей участника
  const resetParticipantFields = () => {
    setTempPartId('');
    setTempPartName('');
    setTempPartSurname('');
    setTempPartRole('');
    setTempPartAmount('');
  };

  // ========================================================================
  // ====================== РЕНДЕР ЭКРАНОВ ===================================
  // ========================================================================

  // ---------- ЭКРАН СПИСКА (LIST) ----------
  if (screenMode === 'list') {
    return (
      <View style={styles.container}>
        {/* Шапка */}
        <View style={[styles.header, { justifyContent: 'center' }]}>
          <Text style={styles.headerTitle}>Debt Management</Text>
        </View>

        {/* Табы (Unpaid / Paid) */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'unpaid' && styles.activeTabButton]}
            onPress={() => setActiveTab('unpaid')}
          >
            <Text style={[styles.tabText, activeTab === 'unpaid' && styles.activeTabText]}>
              Unpaid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'paid' && styles.activeTabButton]}
            onPress={() => setActiveTab('paid')}
          >
            <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>
              Paid
            </Text>
          </TouchableOpacity>
        </View>

        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <View style={styles.cardEmpty}>
              <Image
                source={require('../assets/moneyBag.png')}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>There are no debts here yet...</Text>
            </View>
            <TouchableOpacity style={styles.addButtonEmpty} onPress={handleAddPress}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
              {filteredDebts.map((debt) => {
                const isExpanded = expanded[debt.id];

                return (
                  <View key={debt.id} style={styles.debtCard}>
                    {/* Верхняя часть карточки */}
                    <View style={styles.debtCardHeader}>
                      {/* Левая часть: название + стрелка (тоггл) */}
                      <TouchableOpacity
                        style={styles.debtHeaderLeft}
                        onPress={() => {
                          // Разворачиваем/сворачиваем
                          toggleExpand(debt.id);
                        }}
                      >
                        <Text style={styles.debtTitle}>{debt.title}</Text>
                        <Image
                          source={
                            isExpanded
                              ? require('../assets/arrowDown.png')
                              : require('../assets/arrowRight.png')
                          }
                          style={styles.arrowIcon}
                        />
                      </TouchableOpacity>

                      {/* Кнопка мусорки для удаления всего долга */}
                      <TouchableOpacity onPress={() => handleRemoveDebt(debt.id)}>
                        <Image
                          source={require('../assets/trash.png')}
                          style={styles.trashIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Сумма */}
                    <Text style={styles.debtAmount}>${debt.amount}</Text>

                    {/* Если развернуто – показываем даты, участников и т.п. */}
                    {isExpanded && (
                      <View style={styles.expandedBox}>
                        <Text style={styles.debtDates}>
                          {debt.startDate || '—'} - {debt.endDate || '—'}
                        </Text>

                        {debt.participants && debt.participants.length > 0 && (
                          <View style={styles.debtParticipants}>
                            <Text style={styles.debtParticipantsLabel}>Debt Participants</Text>
                            {debt.participants.map((p, idx) => (
                              <View key={idx} style={styles.participantItem}>
                                <Text style={styles.participantLine}>
                                  {p.name} {p.id}
                                </Text>
                                <Text style={styles.participantLine}>
                                  {p.role || 'Debtor'} {p.amount && `$${p.amount}`}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Кнопка "Edit" - если нужно перейти в редактирование долга */}
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditDebt(debt)}
                        >
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            {/* Плавающая кнопка Add */}
            <TouchableOpacity style={styles.addButtonFloat} onPress={handleAddPress}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // ---------- ЭКРАН «Debt Record» (шаг 1) ----------
  if (screenMode === 'record') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Стрелка «назад» */}
          <TouchableOpacity style={styles.iconButton} onPress={handleGoBackFromRecord}>
            <Image
              source={require('../assets/arrowLeft.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Debt Record</Text>

          {/* «Галочка» → перейти к участникам */}
          <TouchableOpacity style={styles.iconButton} onPress={handleNextToParticipants}>
            <Image
              source={require('../assets/checkIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.center}>
            <Image
              source={require('../assets/moneyBag.png')}
              style={styles.bagImage}
            />
          </View>

          {/* Поля: ID, Title, Amount, Dates */}
          <Text style={styles.label}>Debt Record</Text>

          <TextInput
            style={styles.formInput}
            placeholder="ID"
            placeholderTextColor="#aaa"
            value={currentDebt?.id}
            onChangeText={(val) => setCurrentDebt({ ...currentDebt, id: val })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Title"
            placeholderTextColor="#aaa"
            value={currentDebt?.title}
            onChangeText={(val) => setCurrentDebt({ ...currentDebt, title: val })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={currentDebt?.amount}
            onChangeText={(val) => setCurrentDebt({ ...currentDebt, amount: val })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Creation Date"
            placeholderTextColor="#aaa"
            value={currentDebt?.startDate}
            onChangeText={(val) => setCurrentDebt({ ...currentDebt, startDate: val })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Repayment Date"
            placeholderTextColor="#aaa"
            value={currentDebt?.endDate}
            onChangeText={(val) => setCurrentDebt({ ...currentDebt, endDate: val })}
          />

          {/* Статус: Unpaid / Paid */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                currentDebt?.status === 'unpaid' && styles.statusButtonActive
              ]}
              onPress={() => setCurrentDebt({ ...currentDebt, status: 'unpaid' })}
            >
              <Text
                style={[
                  styles.statusText,
                  currentDebt?.status === 'unpaid' && styles.statusTextActive
                ]}
              >
                Unpaid
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                currentDebt?.status === 'paid' && styles.statusButtonActive
              ]}
              onPress={() => setCurrentDebt({ ...currentDebt, status: 'paid' })}
            >
              <Text
                style={[
                  styles.statusText,
                  currentDebt?.status === 'paid' && styles.statusTextActive
                ]}
              >
                Paid
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------- ЭКРАН «Debt Participants» (шаг 2) ----------
  if (screenMode === 'participants') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Стрелка «назад» → вернуться к Debt Record */}
          <TouchableOpacity style={styles.iconButton} onPress={handleBackFromParticipants}>
            <Image
              source={require('../assets/arrowLeft.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Debt Record</Text>

          {/* Галочка → финальное сохранение и возврат в список */}
          <TouchableOpacity style={styles.iconButton} onPress={handleSaveAll}>
            <Image
              source={require('../assets/checkIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.center}>
            <Image
              source={require('../assets/moneyBag.png')}
              style={styles.bagImage}
            />
          </View>

          <Text style={styles.label}>Debt Participants</Text>

          {/* Поля на всю ширину */}
          <TextInput
            style={styles.formInputFull}
            placeholder="ID"
            placeholderTextColor="#aaa"
            value={tempPartId}
            onChangeText={setTempPartId}
          />
          <TextInput
            style={styles.formInputFull}
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={tempPartName}
            onChangeText={setTempPartName}
          />
          <TextInput
            style={styles.formInputFull}
            placeholder="Surname"
            placeholderTextColor="#aaa"
            value={tempPartSurname}
            onChangeText={setTempPartSurname}
          />
          <TextInput
            style={styles.formInputFull}
            placeholder="Role"
            placeholderTextColor="#aaa"
            value={tempPartRole}
            onChangeText={setTempPartRole}
          />
          <TextInput
            style={styles.formInputFull}
            placeholder="Amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={tempPartAmount}
            onChangeText={setTempPartAmount}
          />

          {/* Кнопка "Add Participant" */}
          <TouchableOpacity
            style={[styles.addParticipantButton, { marginTop: 10 }]}
            onPress={handleAddParticipant}
          >
            <Text style={styles.addParticipantText}>Add Participant</Text>
          </TouchableOpacity>

          {/* Список уже добавленных участников */}
          {currentDebt?.participants?.length > 0 && (
            <View style={styles.participantList}>
              {currentDebt.participants.map((p, idx) => (
                <View key={idx} style={styles.participantItemContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.participantLine}>#{p.id}</Text>
                    <Text style={styles.participantLine}>{p.name}</Text>
                    <Text style={styles.participantLine}>{p.surname}</Text>
                    <Text style={styles.participantLine}>{p.role || 'Debtor'}</Text>
                    <Text style={styles.participantLine}>${p.amount}</Text>
                  </View>

                  {/* Кнопка удаления (trash.png) */}
                  <TouchableOpacity
                    style={styles.trashButton}
                    onPress={() => handleRemoveParticipant(idx)}
                  >
                    <Image
                      source={require('../assets/trash.png')}
                      style={styles.deleteIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return null; // fallback
};

export default Debt;

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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 8,
  },
  icon: {
    width: 17,
    height: 17,
    tintColor: '#000',
    resizeMode: 'contain',
  },

  // Табы
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#7D1D1D',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#6B0000',
  },

  // Пустое состояние (если нет долгов)
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 16,
    resizeMode: 'contain',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    paddingVertical: 16,
  },
  addButtonEmpty: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 152,
    marginTop: 20,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },

  // Карточки в списке
  debtCard: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  debtCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debtTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFD700',
    resizeMode: 'contain',
  },
  trashIcon: {
    width: 24,
    height: 24,
    tintColor: '#FD3C4A',
    resizeMode: 'contain',
  },
  debtAmount: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 6,
  },
  expandedBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffffff44',
    paddingTop: 10,
  },
  debtDates: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  debtParticipants: {
    marginTop: 8,
    backgroundColor: '#7D1D1D',
    borderRadius: 8,
    padding: 10,
  },
  debtParticipantsLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  participantItem: {
    backgroundColor: '#852A2B',
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
  },
  participantLine: {
    color: '#fff',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  editButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Плавающая кнопка Add (когда список не пуст)
  addButtonFloat: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 80,
  },

  // Контент
  content: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    marginTop: 20,
  },
  bagImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  label: {
    marginLeft: 16,
    marginTop: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Поля ввода
  formInput: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },

  // Поля ввода «на всю ширину» в participants
  formInputFull: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },

  // Статус Unpaid / Paid
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  statusButton: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 8,
  },
  statusButtonActive: {
    backgroundColor: '#FFD700',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#000',
  },

  // Кнопка "Add Participant"
  addParticipantButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  addParticipantText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Список участников
  participantList: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
  },
  participantItemContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff44',
    paddingVertical: 8,
    marginBottom: 8,
  },
  participantLine: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 2,
  },
  trashButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteIcon: {
    width: 25,
    height: 25,
    tintColor: '#FD3C4A', // красноватый цвет иконки
    resizeMode: 'contain',
  },
});
