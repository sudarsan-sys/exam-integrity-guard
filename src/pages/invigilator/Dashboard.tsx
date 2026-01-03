import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  FileText,
  Eye,
  ArrowUpRight,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data
const currentExam = {
  name: 'CS101 - Database Management Systems',
  time: { start: '10:00 AM', end: '1:00 PM' },
  venue: 'Examination Hall A, Block 3',
  students: { present: 87, total: 90 },
};

const quickStats = [
  { label: 'Total Reports Today', value: 5, icon: FileText, trend: '+2 from yesterday' },
  { label: 'Pending Reviews', value: 2, icon: Clock, trend: 'Awaiting action' },
  { label: 'Active Exams', value: 1, icon: ClipboardCheck, trend: 'In progress' },
  { label: 'My Total Reports', value: 23, icon: AlertTriangle, trend: 'This semester' },
];

const recentReports = [
  {
    id: 'CASE-2024-001',
    studentName: 'Amit Kumar',
    time: '10:45 AM',
    severity: 'major' as const,
    status: 'pending' as const,
  },
  {
    id: 'CASE-2024-002',
    studentName: 'Priya Sharma',
    time: '11:20 AM',
    severity: 'minor' as const,
    status: 'review' as const,
  },
  {
    id: 'CASE-2024-003',
    studentName: 'Rahul Verma',
    time: '12:05 PM',
    severity: 'severe' as const,
    status: 'pending' as const,
  },
];

const InvigilatorDashboard: React.FC = () => {
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 30, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <DashboardLayout title="Invigilator Dashboard">
      <div className="space-y-6">
        {/* Live Exam Status */}
        <Card className="border-0 shadow-glass bg-gradient-to-br from-card to-secondary/20 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Live Exam Status</CardTitle>
              <Badge variant="success" className="animate-pulse-slow">
                <span className="w-2 h-2 bg-success-foreground rounded-full mr-2 inline-block" />
                In Progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exam Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">{currentExam.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{currentExam.time.start} - {currentExam.time.end}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{currentExam.venue}</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-center md:justify-end">
                <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-6 py-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold font-mono text-primary">
                    {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
                  </span>
                  <span className="text-sm text-muted-foreground">remaining</span>
                </div>
              </div>
            </div>

            {/* Students Present */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Students Present</span>
                </div>
                <span className="font-semibold text-foreground">
                  {currentExam.students.present}/{currentExam.students.total}
                </span>
              </div>
              <Progress value={(currentExam.students.present / currentExam.students.total) * 100} className="h-2" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/invigilator/report">
                <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse-ring shadow-glow-accent gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  🚨 Report Malpractice
                </Button>
              </Link>
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                View Active Reports
              </Button>
              <Button variant="outline" className="gap-2">
                <ClipboardCheck className="w-4 h-4" />
                Mark Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-glass hover:shadow-glass-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="border-0 shadow-glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
            <Link to="/invigilator/reports">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      report.severity === 'minor' ? 'bg-severity-minor' :
                      report.severity === 'major' ? 'bg-severity-major' :
                      'bg-severity-severe'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{report.id}</span>
                        <Badge variant={report.severity} className="text-xs">
                          {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.studentName} • {report.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={report.status}>
                      {report.status === 'pending' ? 'Pending Review' : 'Under Review'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvigilatorDashboard;
