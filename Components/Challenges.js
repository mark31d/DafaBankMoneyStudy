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
import { SwipeListView } from 'react-native-swipe-list-view';

const initialChallenges = [
  {
    id: '1',
    title: 'Run 50 miles in a month',
    description: 'Jog or run daily to achieve the goal',
    goal: 'Complete 50 miles of running',
    duration: '30 days',
    participants: [],
  },
  {
    id: '2',
    title: 'Save $500 by the end of the quarter',
    description: 'Budget your expenses and save consistently',
    goal: 'Accumulate $500 in savings',
    duration: '3 months',
    participants: [],
  },
  {
    id: '3',
    title: 'Cook a healthy meal every day for a month',
    description: 'Explore new recipes and focus on nutritious ingredients',
    goal: 'Prepare a healthy meal daily for 30 days',
    duration: '30 days',
    participants: [],
  },
];

const initialMyChallenges = [];

const Challenges = () => {
  const [allChallenges, setAllChallenges] = useState(initialChallenges);
  const [myChallenges, setMyChallenges] = useState(initialMyChallenges);

  const [activeTab, setActiveTab] = useState('my');

  /**
   * screenMode может быть:
   * 'list'        - список челленджей (My / All)
   * 'createStep1' - шаг 1 создания челленджа
   * 'createStep2' - шаг 2 создания челленджа (Add participants)
   * 'leaderboard' - отдельный экран Leaderboard
   */
  const [screenMode, setScreenMode] = useState('list');

  // Данные челленджа, который создаём
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeGoal, setChallengeGoal] = useState('');
  const [challengeDuration, setChallengeDuration] = useState('');

  // Список участников
  const [participants, setParticipants] = useState([]);

  // Поля для ввода одного участника (шаг 2)
  const [tempName, setTempName] = useState('');
  const [tempSurname, setTempSurname] = useState('');

  // Для раскрытия карточек в списках
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Удаление челленджа
  const handleDeleteChallenge = (id) => {
    if (activeTab === 'my') {
      setMyChallenges(prev => prev.filter(ch => ch.id !== id));
    } else {
      setAllChallenges(prev => prev.filter(ch => ch.id !== id));
    }
  };

  // Начать создание челленджа (шаг 1)
  const handleAddPress = () => {
    // Сбрасываем поля
    setChallengeTitle('');
    setChallengeDescription('');
    setChallengeGoal('');
    setChallengeDuration('');
    setParticipants([]);
    setTempName('');
    setTempSurname('');
    setScreenMode('createStep1');
  };

  // Перейти к шагу 2 (Add participants)
  const goToStep2 = () => {
    if (!challengeTitle || !challengeGoal || !challengeDuration) {
      Alert.alert('Error', 'Please fill Title, Goal, and Duration at least');
      return;
    }
    setScreenMode('createStep2');
  };

  // Сохранить челлендж (шаг 2, галочка)
  const handleSaveChallenge = () => {
    if (!challengeTitle || !challengeGoal || !challengeDuration) {
      Alert.alert('Error', 'Please fill Title, Goal, and Duration at least');
      return;
    }
    const newChallenge = {
      id: String(Date.now()),
      title: challengeTitle,
      description: challengeDescription,
      goal: challengeGoal,
      duration: challengeDuration,
      participants: participants,
    };
    setMyChallenges(prev => [...prev, newChallenge]);
    setScreenMode('list');
    setActiveTab('my');
  };

  // Добавить одного участника (шаг 2)
  const handleAddParticipant = () => {
    if (!tempName || !tempSurname) {
      Alert.alert('Error', 'Please enter Name and Surname');
      return;
    }
    const newPart = { name: tempName, surname: tempSurname };
    setParticipants([...participants, newPart]);
    setTempName('');
    setTempSurname('');
  };

  // ----------------- ЭКРАН LEADERBOARD -----------------
  // Примерные рандомные участники/данные
  const randomLeaders = [
    { id: '1', name: 'Alice Winker', achievement: 'Saved $300 in a month' },
    { id: '2', name: 'Bob Johnson', achievement: 'Ran 100 miles in 2 weeks' },
    { id: '3', name: 'Charlie Brown', achievement: 'Lost 5kg in a month' },
  ];

  if (screenMode === 'leaderboard') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Кнопка назад (стрелка), чтобы вернуться в список */}
          <TouchableOpacity
            onPress={() => setScreenMode('list')}
            style={styles.iconButton}
          >
            <Image
              source={require('../assets/arrowLeft.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Leaderboard</Text>

          {/* Пустая View, чтобы заголовок был по центру */}
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={{ flex: 1, paddingTop: 20 }}>
          {randomLeaders.map(leader => (
            <View key={leader.id} style={styles.leaderCard}>
              {/* Имя */}
              <Text style={styles.leaderName}>{leader.name}</Text>

              {/* Строка: "Achievement" слева, достижение справа */}
              <View style={styles.leaderRow}>
                <Text style={styles.leaderLabel}>Achievement</Text>
                <Text style={styles.leaderAchievement}>{leader.achievement}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ---------- Шаг 2: "Add Participants" ----------
  if (screenMode === 'createStep2') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setScreenMode('createStep1')}
            style={styles.iconButton}
          >
            <Image
              source={require('../assets/arrowLeft.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Challenge</Text>
          <TouchableOpacity
            onPress={handleSaveChallenge}
            style={styles.iconButton}
          >
            <Image
              source={require('../assets/checkIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.center}>
            <Image
              source={require('../assets/trophy.png')}
              style={styles.trophyImage}
            />
          </View>

          <Text style={styles.label}>Add participants</Text>

          <View style={styles.center}>
            <TextInput
              style={styles.formInput}
              placeholder="Name"
              placeholderTextColor="#aaa"
              value={tempName}
              onChangeText={setTempName}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Surname"
              placeholderTextColor="#aaa"
              value={tempSurname}
              onChangeText={setTempSurname}
            />
            <TouchableOpacity
              style={styles.addParticipantButton}
              onPress={handleAddParticipant}
            >
              <Text style={styles.addParticipantText}>Add Participant</Text>
            </TouchableOpacity>
          </View>

          {participants.length > 0 && (
            <View style={styles.participantList}>
              {participants.map((p, idx) => (
                <Text key={idx} style={styles.participantItem}>
                  {p.name} {p.surname}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ---------- Шаг 1: ввод Title, Description, Goal, Duration ----------
  if (screenMode === 'createStep1') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setScreenMode('list')}
            style={styles.iconButton}
          >
            <Image
              source={require('../assets/arrowLeft.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Challenge</Text>

          <TouchableOpacity
            onPress={goToStep2}
            style={styles.iconButton}
          >
            <Image
              source={require('../assets/checkIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.center}>
            <Image
              source={require('../assets/trophy.png')}
              style={styles.trophyImage}
            />
          </View>

          <TextInput
            style={styles.formInput}
            placeholder="Title"
            placeholderTextColor="#aaa"
            value={challengeTitle}
            onChangeText={setChallengeTitle}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Description"
            placeholderTextColor="#aaa"
            value={challengeDescription}
            onChangeText={setChallengeDescription}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Goal"
            placeholderTextColor="#aaa"
            value={challengeGoal}
            onChangeText={setChallengeGoal}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Duration"
            placeholderTextColor="#aaa"
            value={challengeDuration}
            onChangeText={setChallengeDuration}
          />
        </ScrollView>
      </View>
    );
  }

  // ---------- Экран списка (My / All Challenges) ----------
  const currentList = activeTab === 'my' ? myChallenges : allChallenges;
  const isEmpty = currentList.length === 0;

  // Видимая часть карточки
  const renderVisibleCard = ({ item }) => {
    const isExpanded = expanded[item.id];
    const cardStyle = [
      styles.challengeCard,
      activeTab === 'all' && styles.challengeCardAll,
    ];
    const titleStyle = [
      styles.challengeTitle,
      activeTab === 'all' && styles.challengeTitleAll,
    ];
    const descStyle = [
      styles.challengeDescription,
      activeTab === 'all' && styles.challengeDescriptionAll,
    ];
    const goalStyle = [
      styles.challengeGoal,
      activeTab === 'all' && styles.challengeGoalAll,
    ];

    return (
      <View style={cardStyle}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={titleStyle}>{item.title}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.challengeDuration}>{item.duration}</Text>
              <Image
                source={
                  isExpanded
                    ? require('../assets/arrowDown.png')
                    : require('../assets/arrowRight.png')
                }
                style={styles.icon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={descStyle}>{item.description}</Text>
        <Text style={goalStyle}>{item.goal}</Text>

        {isExpanded && (
          <View style={styles.participantSection}>
            {item.participants.map((p, i) => (
              <Text key={i} style={styles.participantItem}>
                {p.name} {p.surname}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Скрытая часть (при свайпе)
  const renderHiddenItem = ({ item }) => (
    <View style={styles.hiddenItemContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteChallenge(item.id)}
      >
        <Image
          source={require('../assets/trash.png')}
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
    </View>
  );

  // Если список пуст
  if (isEmpty) {
    return (
      <View style={styles.container}>
        {/* Шапка */}
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Challenges</Text>

          {/* Нажатие на homeIcon -> экран Leaderboard */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setScreenMode('leaderboard')}
          >
            <Image
              source={require('../assets/homeIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Табы */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
              My Challenges
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              Challenges
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'my' ? (
          <View style={styles.emptyContainer}>
            <View style={styles.cardEmpty}>
              <Image
                source={require('../assets/trophy.png')}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>
                You don't have your own challenges yet
              </Text>
            </View>
            <TouchableOpacity style={styles.addButtonEmpty} onPress={handleAddPress}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No challenges yet...</Text>
          </View>
        )}
      </View>
    );
  }

  // Если список не пуст
  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Challenges</Text>

        {/* Нажатие на homeIcon -> экран Leaderboard */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setScreenMode('leaderboard')}
        >
          <Image
            source={require('../assets/homeIcon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Табы */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            My Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Challenges
          </Text>
        </TouchableOpacity>
      </View>

      {/* Список челленджей */}
      <View style={{ flex: 1 }}>
      <SwipeListView
            data={currentList}
            keyExtractor={(item) => item.id}
            renderItem={renderVisibleCard}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-70}
            disableRightSwipe
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            ListFooterComponent={
              activeTab === 'my' && (
                <TouchableOpacity style={styles.addButtonInList} onPress={handleAddPress}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )
            }
          />
      </View>
    </View>
  );
};

export default Challenges;

const styles = StyleSheet.create({
    addButtonText: {
        color: '#000',
    fontSize: 16,
    fontWeight: '600',
      },
    addButtonInList: { backgroundColor: '#FFD700', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 152, marginTop: 10, alignSelf: 'center' },
  container: {
    flex: 1,
    backgroundColor: '#6B0000', // общий красный фон
  },
  // Шапка
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 63,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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

  // Трофей
  trophyImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginTop: 20,
  },

  // Табы
  tabsContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
  },
  tabButton: {
    borderRadius: 10,
    marginVertical: 12,
    flex: 1,
    backgroundColor: '#7D1D1D',
    paddingVertical: 25,
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

  // Контент (скролл)
  content: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    marginTop: 20,
  },

  // Поля ввода
  formInput: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginTop: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    width: '80%',
    alignSelf: 'center',
  },

  // Кнопка "Add Participant"
  addParticipantButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    marginTop: 30,
    paddingVertical: 16,
    width: '80%',
    alignItems: 'center',
  },
  addParticipantText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Список добавленных участников
  participantList: {
    backgroundColor: '#852A2B',
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  participantItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },

  // Подпись "Add participants"
  label: {
    marginLeft: 16,
    marginTop: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Пустое состояние
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmpty: {
    marginTop: -100,
    backgroundColor: '#852A2B',
    borderRadius: 12,
    padding: 22,
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
    paddingHorizontal: 155,
    marginTop: 10,
  },

  // Карточки челленджей
  challengeCard: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  challengeCardAll: {
    padding: 24,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeDuration: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 8,
  },
  challengeTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  challengeDescription: {
    color: '#fff',
    marginBottom: 2,
    fontSize: 14,
  },
  challengeGoal: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 14,
  },
  challengeTitleAll: {
    fontSize: 18,
  },
  challengeDescriptionAll: {
    fontSize: 15,
  },
  challengeGoalAll: {
    fontSize: 15,
  },

  // Раскрытая часть (участники в карточке)
  participantSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ffffff44',
  },
  participantItem: {
    color: '#fff',
    fontSize: 15,
    marginVertical: 2,
    paddingLeft: 6,
  },

  // Скрытая часть (Swipe)
  hiddenItemContainer: {
    flex: 1,
    backgroundColor: '#6B0000',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
  },
  deleteButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    width: 35,
    height: 35,
    tintColor: '#FD3C4A',
    resizeMode: 'contain',
  },

  // Стили для экрана Leaderboard
  leaderCard: {
    backgroundColor: '#852A2B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  leaderName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  leaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leaderLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  leaderAchievement: {
    color: '#fff',
    fontSize: 14,
  },
});

