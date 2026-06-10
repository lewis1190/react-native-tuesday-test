import { useAuth } from "@/context/AuthContext";
import { registerWithFirebase } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Paragraph,
    Snackbar,
    Text,
    TextInput,
} from "react-native-paper";

export default function RegisterScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleRegister = async () => {
    setError(null);

    // Validation
    if (!email.trim()) {
      setError("Please enter an email address");
      setShowError(true);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setShowError(true);
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      setShowError(true);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      await registerWithFirebase(email, password);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      login();
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (err instanceof Error) {
        if (err.message.includes("email-already-in-use")) {
          errorMessage = "This email is already registered";
        } else if (err.message.includes("weak-password")) {
          errorMessage = "Password is too weak";
        } else if (err.message.includes("invalid-email")) {
          errorMessage = "Invalid email address";
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

  const handleLoginNavigation = () => {
    router.replace("/");
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Create Account</Text>
            <Paragraph style={styles.subtitle}>
              Sign up to get started
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
              placeholder="Enter password (min 6 characters)"
              editable={!loading}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry
              placeholder="Confirm password"
              editable={!loading}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Register
            </Button>

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Button
                mode="text"
                onPress={handleLoginNavigation}
                disabled={loading}
                compact
                style={styles.loginLink}
              >
                Login here
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    minHeight: "100%",
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
  },
  button: {
    paddingVertical: 8,
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    marginLeft: 0,
  },
  snackbar: {
    backgroundColor: "#d32f2f",
  },
});
