import { useAuth } from "@/context/AuthContext";
import { loginWithFirebase } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Paragraph,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      setShowError(true);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      await loginWithFirebase(email, password);
      setEmail("");
      setPassword("");
      login();
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err instanceof Error) {
        if (err.message.includes("user-not-found")) {
          errorMessage = "No account found with this email";
        } else if (err.message.includes("wrong-password")) {
          errorMessage = "Incorrect password";
        } else if (err.message.includes("invalid-email")) {
          errorMessage = "Invalid email address";
        } else if (err.message.includes("user-disabled")) {
          errorMessage = "This account has been disabled";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNavigation = () => {
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Login</Text>
          <Paragraph style={styles.subtitle}>
            Enter your credentials to continue
          </Paragraph>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Enter your email"
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholder="Enter password"
            editable={!loading}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Login
          </Button>

          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Button
              mode="text"
              onPress={handleRegisterNavigation}
              disabled={loading}
              compact
              style={styles.registerLink}
            >
              Register here
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    marginLeft: 0,
  },
  snackbar: {
    backgroundColor: "#c62828",
  },
});
