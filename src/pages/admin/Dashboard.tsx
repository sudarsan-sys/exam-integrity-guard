import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreVertical,
  Filter,
  Download,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const topStats = [
  { label: 'Pending Cases', value: 12, icon: Clock, color: 'destructive', trend: '+3 from last week', trendUp: true },
  { label: 'Under Review', value: 8, icon: Eye, color: 'warning', trend: '+2 from last week', trendUp: true },
  { label: 'Resolved This Month', value: 45, icon: FileText, color: 'success', trend: '+15% vs last month', trendUp: true },
  { label: 'Total Cases', value: 150, icon: Users, color: 'info', trend: 'This semester', trendUp: false },
];

const trendData = [
  { month: 'Aug', cases: 18 },
  { month: 'Sep', cases: 25 },
  { month: 'Oct', cases: 32 },
  { month: 'Nov', cases: 28 },
  { month: 'Dec', cases: 22 },
  { month: 'Jan', cases: 25 },
];

const departmentData = [
  { name: 'CSE', cases: 45 },
  { name: 'ECE', cases: 32 },
  { name: 'MECH', cases: 28 },
  { name: 'CIVIL', cases: 22 },
  { name: 'EEE', cases: 15 },
  { name: 'IT', cases: 8 },
];

const severityData = [
  { name: 'Minor', value: 40, color: 'hsl(152, 60%, 45%)' },
  { name: 'Major', value: 45, color: 'hsl(38, 95%, 55%)' },
  { name: 'Severe', value: 15, color: 'hsl(0, 75%, 55%)' },
];

const recentCases = [
  {
    id: 'CASE-2024-001',
    studentName: 'Amit Kumar',
    rollNo: 'CS2021001',
    exam: 'CS101 - Database Management',
    reportedBy: 'Dr. Sharma',
    date: '2024-01-15',
    time: '10:45 AM',
    severity: 'major' as const,
    status: 'pending' as const,
    priority: 2,
  },
  {
    id: 'CASE-2024-002',
    studentName: 'Priya Sharma',
    rollNo: 'CS2021002',
    exam: 'CS102 - Data Structures',
    reportedBy: 'Dr. Patel',
    date: '2024-01-15',
    time: '11:20 AM',
    severity: 'minor' as const,
    status: 'review' as const,
    priority: 1,
  },
  {
    id: 'CASE-2024-003',
    studentName: 'Rahul Verma',
    rollNo: 'EC2021001',
    exam: 'EC201 - Digital Electronics',
    reportedBy: 'Dr. Sharma',
    date: '2024-01-14',
    time: '2:30 PM',
    severity: 'severe' as const,
    status: 'pending' as const,
    priority: 3,
  },
  {
    id: 'CASE-2024-004',
    studentName: 'Sneha Patel',
    rollNo: 'ME2021003',
    exam: 'ME301 - Thermodynamics',
    reportedBy: 'Dr. Kumar',
    date: '2024-01-14',
    time: '9:15 AM',
    severity: 'major' as const,
    status: 'resolved' as const,
    priority: 2,
  },
  {
    id: 'CASE-2024-005',
    studentName: 'Vikram Singh',
    rollNo: 'CS2021005',
    exam: 'CS101 - Database Management',
    reportedBy: 'Dr. Sharma',
    date: '2024-01-13',
    time: '11:00 AM',
    severity: 'minor' as const,
    status: 'dismissed' as const,
    priority: 1,
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-glass hover:shadow-glass-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {stat.trendUp ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className={stat.trendUp ? 'text-success' : 'text-muted-foreground'}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl ${
                    stat.color === 'destructive' ? 'bg-destructive/10' :
                    stat.color === 'warning' ? 'bg-warning/10' :
                    stat.color === 'success' ? 'bg-success/10' :
                    'bg-info/10'
                  }`}>
                    <stat.icon className={`w-5 h-5 ${
                      stat.color === 'destructive' ? 'text-destructive' :
                      stat.color === 'warning' ? 'text-warning' :
                      stat.color === 'success' ? 'text-success' :
                      'text-info'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Malpractice Trends */}
          <Card className="border-0 shadow-glass">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Malpractice Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cases"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department-wise Cases */}
          <Card className="border-0 shadow-glass">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Department-wise Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Severity Distribution */}
        <Card className="border-0 shadow-glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3">
                {severityData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Cases Table */}
        <Card className="border-0 shadow-glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Cases</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input placeholder="Search cases..." className="w-64 pl-4 pr-10" />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Exam</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reported By</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link to={`/admin/cases/${caseItem.id}`} className="text-sm font-medium text-primary hover:underline">
                          {caseItem.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{caseItem.studentName}</p>
                          <p className="text-xs text-muted-foreground">{caseItem.rollNo}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-foreground truncate max-w-[200px]">{caseItem.exam}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-foreground">{caseItem.reportedBy}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-foreground">{caseItem.date}</p>
                        <p className="text-xs text-muted-foreground">{caseItem.time}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={caseItem.severity}>
                          {caseItem.severity.charAt(0).toUpperCase() + caseItem.severity.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={caseItem.status}>
                          {caseItem.status === 'pending' ? 'Pending' :
                           caseItem.status === 'review' ? 'Under Review' :
                           caseItem.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((star) => (
                            <span key={star} className={star <= caseItem.priority ? 'text-warning' : 'text-muted'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
