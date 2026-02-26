import React, { useState, useEffect } from 'react';

// --- Local mocks to bypass compilation errors in this preview environment ---
// Note: When copying to your actual React Native project in VS Code, replace these mocks with the real imports:
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
// import { router } from 'expo-router';
// import { Feather, Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import { API_URL } from './index';

// Helper to flatten React Native array styles for the web preview
const flattenStyle = (s: any) => Array.isArray(s) ? Object.assign({}, ...s.filter(Boolean)) : s;

const View: any = ({ children, style }: any) => <div style={flattenStyle(style)}>{children}</div>;
const Text: any = ({ children, style }: any) => <div style={flattenStyle(style)}>{children}</div>;
const TouchableOpacity: any = ({ children, onPress, style }: any) => <div onClick={onPress} style={{ cursor: 'pointer', ...flattenStyle(style) }}>{children}</div>;
const ScrollView: any = ({ children, style, contentContainerStyle }: any) => <div style={{ overflowY: 'auto', ...flattenStyle(style), ...flattenStyle(contentContainerStyle) }}>{children}</div>;
const SafeAreaView: any = ({ children, style }: any) => <div style={flattenStyle(style)}>{children}</div>;
const ActivityIndicator: any = () => <div>Loading...</div>;
const StyleSheet = { create: (styles: any) => styles };
const Platform = { OS: 'web' };
const router = { replace: (route: string) => alert(`Navigating to ${route}`) };
const Feather: any = () => <span />;
const Ionicons: any = () => <span />;
const API_URL = 'http://172.19.32.1:5001/api';
const axios = {
  get: async (url: string) => ({
    data: {
      success: true,
      stats: { totalReports: 11, pendingReports: 6, activeExams: 1, myReports: 11 },
      recentReports: [
        { id: 'CASE-43', studentName: 'anbu', time: '10:52 pm', status: 'review', severity: 'major' },
        { id: 'CASE-11', studentName: 'Harry Potter', time: '03:14 pm', status: 'pending', severity: 'major' }
      ]
    }
  })
};
// --------------------------------------------------------------------------

export default function DashboardScreen() {
  const [stats, setStats] = useState({ totalReports: 0, pendingReports: 0, activeExams: 0, myReports: 0 });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔌 HOW IT CONNECTS TO DB:
  // When this screen loads, it hits your backend reportController.ts
  // which queries PostgreSQL and returns the stats.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/reports/dashboard`);
        if (response.data.success) {
          setStats(response.data.stats);
          setRecentReports(response.data.recentReports);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Ionicons name="school" size={24} color="#f59e0b" />
          <Text style={styles.topBarTitle}>ExamGuard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.pageTitle}>Invigilator Dashboard</Text>
          <Text style={styles.userName}>Dr. Severus Snape</Text>
        </View>

        {/* Live Exam Card */}
        <View style={styles.liveExamCard}>
          <View style={styles.liveHeader}>
            <Text style={styles.cardTitle}>Live Exam Status</Text>
            <View style={styles.badgeSuccess}>
              <View style={styles.dot} />
              <Text style={styles.badgeSuccessText}>In Progress</Text>
            </View>
          </View>

          <Text style={styles.examName}>CS101 - Database Management Systems</Text>

          <View style={styles.examDetailsRow}>
            <Feather name="clock" size={14} color="#64748b" />
            <Text style={styles.examDetailsText}>10:00 AM - 1:00 PM</Text>
            <Feather name="map-pin" size={14} color="#64748b" style={{ marginLeft: 10 }} />
            <Text style={styles.examDetailsText}>Hall A, Block 3</Text>
          </View>

          <View style={styles.timerBox}>
            <Feather name="clock" size={18} color="#0f172a" />
            <Text style={styles.timerText}>02 : 28 : 30</Text>
            <Text style={styles.timerSub}>remaining</Text>
          </View>

          {/* REPORT BUTTON */}
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => alert("Ready to build Report screen next!")}
          >
            <Feather name="alert-triangle" size={18} color="#ffffff" />
            <Text style={styles.reportButtonText}>Report Malpractice</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard title="Total Reports" value={stats.totalReports} icon="file-text" loading={loading} />
          <StatCard title="Pending Review" value={stats.pendingReports} icon="clock" loading={loading} />
          <StatCard title="Active Exams" value={stats.activeExams} icon="check-square" loading={loading} />
          <StatCard title="My Reports" value={stats.myReports} icon="alert-circle" loading={loading} />
        </View>

        {/* Recent Reports */}
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        <View style={styles.recentReportsCard}>
          {loading ? (
            <ActivityIndicator color="#2563eb" style={{ padding: 20 }} />
          ) : recentReports.length === 0 ? (
            <Text style={styles.emptyText}>No recent reports found.</Text>
          ) : (
            recentReports.map((report, index) => (
              <View key={report.id} style={[styles.reportItem, index === recentReports.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.reportItemLeft}>
                  <View style={[styles.statusDot, report.status === 'pending' ? { backgroundColor: '#ef4444' } : { backgroundColor: '#f59e0b' }]} />
                  <View>
                    <View style={styles.reportIdRow}>
                      <Text style={styles.reportId}>{report.id}</Text>
                      <View style={styles.severityBadge}>
                        <Text style={styles.severityText}>{report.severity.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.reportDesc}>{report.studentName} • {report.time}</Text>
                  </View>
                </View>
                <View style={styles.reportBadge}>
                  <Text style={styles.reportBadgeText}>
                    {report.status === 'pending' ? 'Pending Review' : 'Under Review'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable component for the 4 stat boxes
const StatCard = ({ title, value, icon, loading }: any) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <Text style={styles.statTitle}>{title}</Text>
      <Feather name={icon as any} size={16} color="#64748b" />
    </View>
    {loading ? (
      <ActivityIndicator size="small" color="#2563eb" />
    ) : (
      <Text style={styles.statValue}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  userName: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  liveExamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
    marginRight: 4,
  },
  badgeSuccessText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
  examName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  examDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  examDetailsText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0f172a',
    marginLeft: 8,
    marginRight: 6,
  },
  timerSub: {
    fontSize: 12,
    color: '#64748b',
  },
  reportButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  reportButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  recentReportsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  reportItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  reportIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  reportId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  severityBadge: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  reportDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  reportBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reportBadgeText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: 20,
  }
});