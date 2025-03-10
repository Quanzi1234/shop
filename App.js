import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Button, StyleSheet, Text } from 'react-native';
import { db } from './firebaseConfig';
import { IconButton } from 'react-native-paper';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch items from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'shoppingList'),
      (snapshot) => {
        const fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching documents: ", error);
        setLoading(false);
      }
    );
  
    return () => unsubscribe();
  }, []);
  
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const addItem = async () => {
    if (newItem.trim()) {
      try {
        await addDoc(collection(db, 'shoppingList'), {
          name: newItem.trim(),
          completed: false,
        });
        setNewItem('');
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'shoppingList', id));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const toggleCompletion = async (id, completed) => {
    try {
      await updateDoc(doc(db, 'shoppingList', id), {
        completed: !completed,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new item"
          value={newItem}
          onChangeText={setNewItem}
        />
        <Button title="Add" onPress={addItem} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text
              style={[styles.itemText, item.completed && styles.completedText]}
            >
              {item.name}
            </Text>
            <View style={styles.actions}>
              <IconButton
                icon={item.completed ? 'check-circle' : 'circle-outline'}
                onPress={() => toggleCompletion(item.id, item.completed)}
              />
              <IconButton
                icon="delete"
                onPress={() => removeItem(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
  },
});

export default App;