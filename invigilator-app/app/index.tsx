import React, { useState } from 'react';
import axios from 'axios';

// --- Local mocks to bypass compilation errors in this preview environment ---
// Note: When copying to your actual React Native project, restore the original imports:
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
// import { router } from 'expo-router';
// import { Feather, Ionicons } from '@expo/vector-icons';
const View: any = ({ children, style }: any) => <div style={style}>{children}</div>;
const Text: any = ({ children, style }: any) => <div style={style}>{children}</div>;
const TextInput: any = ({ value, onChangeText, placeholder, secureTextEntry, style }: any) => <input type={secureTextEntry ? 'password' : 'text'} value={value} onChange={(e) => onChangeText(e.target.value)} placeholder={placeholder} style={{ ...style, outline: 'none' }} />;
const TouchableOpacity: any = ({ children, onPress, style, disabled }: any) => <div onClick={disabled ? undefined : onPress} style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, display: 'flex', ...style }}>{children}</div>;
const StyleSheet = { create: (styles: any) => styles };
const Alert = { alert: (title: string, msg: string) => window.alert(`${title}\n\n${msg}`) };
const ActivityIndicator: any = () => <div>Loading...</div>;
const KeyboardAvoidingView: any = ({ children, style }: any) => <div style={style}>{children}</div>;
const Platform = { OS: 'web' };
const SafeAreaView: any = ({ children, style }: any) => <div style={style}>{children}</div>;
const router = { replace: (route: string) => alert(`Navigating to ${route}`) };
const Feather: any = () => <span />;
const Ionicons: any = () => <span />;
// --------------------------------------------------------------------------

// 🔴 CRITICAL: Replace with your computer's actual Wi-Fi IPv4 Address
// Find it by typing 'ipconfig' (Windows) or 'ifconfig' (Mac) in your terminal.
// Example: const API_URL = 'http://192.168.1.5:5000/api';
export const API_URL = 'http://172.19.32.1:5001/api'; // <--- CHANGE ME

export default function LoginScreen() {
    const [identifier, setIdentifier] = useState('snape@college.edu'); // Pre-filled for testing
    const [password, setPassword] = useState('any');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert("Required", "Please enter both Email/ID and Password.");
            return;
        }

        setLoading(true);
        try {
            // 🔌 HOW IT CONNECTS TO DB:
            // This sends a POST request to your Node.js server (authController.ts).
            // Your server uses Prisma to check the PostgreSQL database.
            const response = await axios.post(`${API_URL}/auth/login`, {
                identifier: identifier,
                password: password,
                role: 'invigilator' // Hardcoded since this is the Invigilator App
            });

            if (response.data.success) {
                // If PostgreSQL confirms the user, navigate to dashboard
                router.replace('/dashboard');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Login failed. Ensure your Node server is running and the IP address is correct.";
            Alert.alert("Login Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header / Logo */}
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <Ionicons name="school" size={40} color="#ffffff" />
                    </View>
                    <Text style={styles.title}>ExamGuard</Text>
                    <Text style={styles.subtitle}>Malpractice Detection System</Text>
                </View>

                {/* Login Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sign in</Text>

                    {/* Role Dropdown (Visual Only for this App) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Login as</Text>
                        <View style={[styles.inputContainer, { backgroundColor: '#f8fafc' }]}>
                            <Feather name="shield" size={18} color="#64748b" style={styles.inputIcon} />
                            <Text style={styles.inputText}>Invigilator</Text>
                            <Feather name="chevron-down" size={18} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                        </View>
                    </View>

                    {/* Email/ID Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address or Staff ID</Text>
                        <View style={styles.inputContainer}>
                            <Feather name="user" size={18} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. prof@college.edu"
                                placeholderTextColor="#94a3b8"
                                value={identifier}
                                onChangeText={setIdentifier}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Feather name="lock" size={18} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                        <TouchableOpacity><Text style={styles.footerLink}>Sign Up</Text></TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef2f6', // Light blue-ish background from your web UI
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoBox: {
        backgroundColor: '#2563eb', // Blue
        width: 70,
        height: 70,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputText: {
        color: '#0f172a',
        fontSize: 15,
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#0f172a',
        fontSize: 15,
    },
    loginButton: {
        backgroundColor: '#2563eb',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#64748b',
        fontSize: 13,
    },
    footerLink: {
        color: '#2563eb',
        fontSize: 13,
        fontWeight: '600',
    }
});