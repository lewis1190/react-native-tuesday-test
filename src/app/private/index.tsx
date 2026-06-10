import { useAuth } from "@/context/AuthContext";
import { getItems } from "@/services/api";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Paragraph, Text } from "react-native-paper";

interface Item {
  id: number;
  name: string;
  description: string;
}

export default function HomeScreen() {
  const { logout } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError("Failed to load items");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems]),
  );

  const handleLogout = () => {
    logout();
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Card style={styles.itemCard}>
      <Card.Content>
        <Paragraph style={styles.itemName}>{item.name}</Paragraph>
        <Paragraph style={styles.itemDescription}>{item.description}</Paragraph>
        <Text style={styles.itemId}>ID: {item.id}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Paragraph style={styles.title}>Welcome!</Paragraph>
          <Paragraph style={styles.subtitle}>
            You have successfully logged in.
          </Paragraph>
        </Card.Content>
      </Card>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            mode="outlined"
            onPress={fetchItems}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : items.length === 0 ? (
        <Text style={styles.emptyText}>No items available</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
          style={styles.flatList}
        />
      )}

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  flatList: {
    flex: 1,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 8,
  },
  itemCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: "#ffffff",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  itemId: {
    fontSize: 12,
    color: "#999",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginVertical: 32,
  },
  retryButton: {
    borderColor: "#6200ee",
  },
  button: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
