import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
    Auth,
    createUserWithEmailAndPassword,
    getAuth,
    getReactNativePersistence,
    initializeAuth,
    signInWithEmailAndPassword
} from "firebase/auth";

const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase Config:", {
    apiKey: firebaseConfig.apiKey ? "****" : "MISSING",
    authDomain: firebaseConfig.authDomain ? "****" : "MISSING",
    projectId: firebaseConfig.projectId ? "****" : "MISSING",
    storageBucket: firebaseConfig.storageBucket ? "****" : "MISSING",
    messagingSenderId: firebaseConfig.messagingSenderId
        ? "****"
        : "MISSING",
    appId: firebaseConfig.appId ? "****" : "MISSING",
});

let firebaseApp: FirebaseApp | null = null;
let auth = null;
let firebaseAuth: Auth | null = null;


// Initialize Firebase
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
    auth = initializeAuth(firebaseApp, {
        persistence,
    });
    firebaseAuth = getAuth(firebaseApp);
}

// Login with username/password via API
export const loginWithAPI = async (
    username: string,
    password: string,
): Promise<any> => {
    try {
        console.log("Attempting login with:", { username });
        const response = await apiClient.post("/login", {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

// Register with email and password via Firebase
export const registerWithFirebase = async (
    email: string,
    password: string,
): Promise<any> => {
    try {
        console.log("Attempting Firebase registration with:", { email });
        const userCredential = await createUserWithEmailAndPassword(
            firebaseAuth as Auth,
            email,
            password,
        );
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            token: await userCredential.user.getIdToken(),
        };
    } catch (error) {
        console.error("Registration Error:", error);
        throw error;
    }
};

// Login with Firebase
export const loginWithFirebase = async (
    email: string,
    password: string,
): Promise<any> => {
    try {
        console.log("Attempting Firebase login with:", { email });
        const userCredential = await signInWithEmailAndPassword(
            firebaseAuth as Auth,
            email,
            password,
        );
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            token: await userCredential.user.getIdToken(),
        };
    } catch (error) {
        console.error("Firebase Login Error:", error);
        throw error;
    }
};

export default apiClient;
