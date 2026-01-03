import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  MessageSquare,
  Calendar,
  ArrowRight,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data - no active case
const hasActiveCase = true;
const activeCase = {
  id: 'CASE-2024-001',
  exam: 'CS101 - Database Management Systems',
  date: '2024-01-15',
  allegationType: 'Unauthorized material (cheat sheet)',
  severity: 'major' as const,
  status: 'pending' as const,
  responseDeadline: '2024-01-22',
  daysRemaining: 5,
  timeline: [
    { step: 'Reported', completed: true, date: 'Jan 15, 2024' },
    { step: 'Notice Sent', completed: true, date: 'Jan 16, 2024' },
    { step: 'Response Submitted', completed: false, date: null },
    { step: 'Hearing Scheduled', completed: false, date: null },
    { step: 'Decision Made', completed: false, date: null },
  ],
};

const StudentDashboard: React.FC = () => {
  const currentStep = activeCase.timeline.findIndex((step) => !step.completed);
  const progressPercentage = (currentStep / (activeCase.timeline.length - 1)) * 100;

  if (!hasActiveCase) {
    // Good standing view
    return (
      <DashboardLayout title="Student Dashboard">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-24 h-24 rounded-full bg-success/10 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Your Academic Record is Clear</h1>
          <p className="text-lg text-muted-foreground mb-6">No pending malpractice cases</p>
          <p className="text-muted-foreground mb-8">
            Keep up the good academic integrity! Your commitment to honest work is appreciated.
          </p>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            View University Exam Guidelines
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        {/* Alert Banner */}
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">You have 1 active malpractice case</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Case ID: <span className="font-medium text-foreground">{activeCase.id}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/student/cases">
                <Button size="sm" className="gap-2">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/student/respond">
                <Button size="sm" variant="outline" className="gap-2 border-warning text-warning hover:bg-warning/10">
                  <FileText className="w-4 h-4" />
                  Submit Your Response
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Case Details Card */}
        <Card className="border-0 shadow-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Case Details</CardTitle>
              <Badge variant={activeCase.status}>
                {activeCase.status === 'pending' ? 'Awaiting Response' : 'Under Review'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Case ID</p>
                <p className="font-medium text-foreground">{activeCase.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Exam</p>
                <p className="font-medium text-foreground">{activeCase.exam}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Incident Date</p>
                <p className="font-medium text-foreground">{activeCase.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Type of Allegation</p>
                <p className="font-medium text-foreground">{activeCase.allegationType}</p>
              </div>
            </div>

            {/* Response Deadline */}
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">Response Deadline</span>
                </div>
                <span className="text-sm font-bold text-destructive">
                  {activeCase.daysRemaining} days remaining
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                You must submit your response by <span className="font-medium">{activeCase.responseDeadline}</span>
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Case Progress</h4>
              <Progress value={progressPercentage} className="h-2" />
              <div className="grid grid-cols-5 gap-2">
                {activeCase.timeline.map((step, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        step.completed
                          ? 'bg-success text-success-foreground'
                          : index === currentStep
                          ? 'bg-primary text-primary-foreground animate-pulse-ring'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.step}
                    </p>
                    {step.date && <p className="text-xs text-muted-foreground mt-1">{step.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Actions */}
        <Card className="border-0 shadow-glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Available Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/student/cases" className="block">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">View Case Details</p>
                    <p className="text-xs text-muted-foreground">See full incident report</p>
                  </div>
                </Button>
              </Link>
              <Link to="/student/respond" className="block">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-warning/50 hover:bg-warning/10">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <MessageSquare className="w-5 h-5 text-warning" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Submit Written Explanation</p>
                    <p className="text-xs text-muted-foreground">Deadline in {activeCase.daysRemaining} days</p>
                  </div>
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="p-2 rounded-lg bg-secondary">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Upload Supporting Evidence</p>
                  <p className="text-xs text-muted-foreground">Documents, certificates, etc.</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="p-2 rounded-lg bg-secondary">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Request Hearing</p>
                  <p className="text-xs text-muted-foreground">Present your case in person</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-0 shadow-glass">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-info/10">
                  <Shield className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Your Rights</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You have the right to know the allegations, submit a written defense, and request a hearing.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary text-sm">
                    Learn more →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-glass">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-secondary">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Contact the academic integrity office for guidance on the process.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary text-sm">
                    Contact support →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
