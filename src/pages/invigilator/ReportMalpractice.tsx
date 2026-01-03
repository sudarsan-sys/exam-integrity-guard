import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Upload,
  Camera,
  Video,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  FileText,
  Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, title: 'Student ID', icon: User },
  { id: 2, title: 'Incident Details', icon: FileText },
  { id: 3, title: 'Evidence', icon: Image },
  { id: 4, title: 'Review', icon: Check },
];

const malpracticeTypes = [
  { value: 'unauthorized_material', label: 'Unauthorized material (cheat sheet, notes)' },
  { value: 'electronic_device', label: 'Electronic device usage' },
  { value: 'communication', label: 'Communication with other students' },
  { value: 'copying', label: 'Copying from another student' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'other', label: 'Other' },
];

const mockStudents = [
  { id: '1', name: 'Amit Kumar', rollNo: 'CS2021001', department: 'Computer Science', seatNo: 'A-15' },
  { id: '2', name: 'Priya Sharma', rollNo: 'CS2021002', department: 'Computer Science', seatNo: 'A-16' },
  { id: '3', name: 'Rahul Verma', rollNo: 'EC2021001', department: 'Electronics', seatNo: 'B-22' },
];

const ReportMalpractice: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Student Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  
  // Step 2: Incident Details
  const [incidentTime, setIncidentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [malpracticeType, setMalpracticeType] = useState('');
  const [otherType, setOtherType] = useState('');
  const [severity, setSeverity] = useState<'minor' | 'major' | 'severe' | ''>('');
  const [description, setDescription] = useState('');
  
  // Step 3: Evidence
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: string }[]>([]);
  const [witnessName, setWitnessName] = useState('');
  
  // Step 4: Confirmation
  const [confirmed, setConfirmed] = useState(false);

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.seatNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFiles([
      ...uploadedFiles,
      { name: `evidence_${uploadedFiles.length + 1}.jpg`, type: 'image/jpeg', size: '2.4 MB' },
    ]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedStudent !== null;
      case 2:
        return malpracticeType && severity && description.length >= 50;
      case 3:
        return true; // Evidence is optional
      case 4:
        return confirmed;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Report Submitted Successfully',
      description: 'Case ID: CASE-2024-004 has been created.',
    });
    
    setIsSubmitting(false);
    navigate('/invigilator/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Seat Number, Roll Number, or Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className={`cursor-pointer transition-all ${
                    selectedStudent?.id === student.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{student.name}</h4>
                          {selectedStudent?.id === student.id && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {student.rollNo} • {student.department}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          Seat: {student.seatNo}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Time of Incident */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Time of Incident</Label>
              <div className="relative w-48">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Malpractice Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Type of Malpractice</Label>
              <div className="grid gap-2">
                {malpracticeTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      malpracticeType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="malpracticeType"
                      value={type.value}
                      checked={malpracticeType === type.value}
                      onChange={(e) => setMalpracticeType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      malpracticeType === type.value ? 'border-primary' : 'border-muted-foreground'
                    }`}>
                      {malpracticeType === type.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
              {malpracticeType === 'other' && (
                <Input
                  placeholder="Please specify the type of malpractice"
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Severity */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Severity Level</Label>
              <div className="flex gap-3">
                {[
                  { value: 'minor', label: 'Minor', emoji: '🟢', color: 'border-severity-minor bg-severity-minor/10' },
                  { value: 'major', label: 'Major', emoji: '🟡', color: 'border-severity-major bg-severity-major/10' },
                  { value: 'severe', label: 'Severe', emoji: '🔴', color: 'border-severity-severe bg-severity-severe/10' },
                ].map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setSeverity(level.value as 'minor' | 'major' | 'severe')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      severity === level.value ? level.color : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{level.emoji}</span>
                    <span className="text-sm font-medium">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Description</Label>
              <Textarea
                placeholder="Provide a detailed description of the incident (minimum 50 characters)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className={`text-xs ${description.length >= 50 ? 'text-success' : 'text-muted-foreground'}`}>
                {description.length}/50 characters minimum
              </p>
            </div>

            {/* Auto-filled Location */}
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Location: Examination Hall A, Block 3 • Seat: {selectedStudent?.seatNo}</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">Drag and drop files here</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports: Images (JPG, PNG), Videos (MP4), Documents (PDF)
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleFileUpload} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
                <Button variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Take Photo
                </Button>
                <Button variant="outline" className="gap-2">
                  <Video className="w-4 h-4" />
                  Record Video
                </Button>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Uploaded Evidence</Label>
                <div className="grid gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Image className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-destructive/10 rounded text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Witness Information */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Witness Information (Optional)</Label>
              <Input
                placeholder="Co-invigilator name"
                value={witnessName}
                onChange={(e) => setWitnessName(e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Summary */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Student Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Name:</p>
                    <p className="text-foreground">{selectedStudent?.name}</p>
                    <p className="text-muted-foreground">Roll Number:</p>
                    <p className="text-foreground">{selectedStudent?.rollNo}</p>
                    <p className="text-muted-foreground">Department:</p>
                    <p className="text-foreground">{selectedStudent?.department}</p>
                    <p className="text-muted-foreground">Seat Number:</p>
                    <p className="text-foreground">{selectedStudent?.seatNo}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Incident Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Time:</p>
                    <p className="text-foreground">{incidentTime}</p>
                    <p className="text-muted-foreground">Type:</p>
                    <p className="text-foreground">
                      {malpracticeTypes.find(t => t.value === malpracticeType)?.label}
                    </p>
                    <p className="text-muted-foreground">Severity:</p>
                    <Badge variant={severity as "minor" | "major" | "severe"}>{severity}</Badge>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Description:</p>
                    <p className="text-sm text-foreground">{description}</p>
                  </div>
                </CardContent>
              </Card>

              {uploadedFiles.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Evidence ({uploadedFiles.length} files)
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {uploadedFiles.map((file, index) => (
                        <Badge key={index} variant="secondary">{file.name}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Confirmation */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              />
              <Label htmlFor="confirm" className="text-sm cursor-pointer">
                I confirm that all information provided in this report is accurate and complete to the best of my knowledge.
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Report Malpractice">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? 'bg-success text-success-foreground'
                        : currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-glass mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {steps[currentStep - 1].title}
            </h2>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-3">
            {currentStep < 4 && (
              <Button variant="outline">
                Save as Draft
              </Button>
            )}
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="bg-destructive hover:bg-destructive/90 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportMalpractice;
