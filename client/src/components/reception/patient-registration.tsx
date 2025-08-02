import { useState } from 'react';
import { usePatients } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Loader2, User, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  name: string;
  type: string;
  dose: string;
  duration: string;
}

export function PatientRegistration() {
  const { createPatient, isCreating } = usePatients();
  const { toast } = useToast();
  
  const [form, setForm] = useState({
    patientId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    insuranceNumber: '',
    nationalId: '',
    treatingDoctor: '',
    landline: '',
    fastingHours: '',
    isFasting: false,
    isDiabetic: false,
    isOnBloodThinner: false,
    isOnAntibiotics: false,
    isOnThyroidMedication: false,
    isOnKidneyTreatment: false,
    isOnLiverTreatment: false,
    isOnCholesterolMedication: false,
    isOnCortisone: false,
    hadContrastScan: false,
    hadBloodTransfusion: false,
    bloodTransfusionDate: '',
    hadSurgeries: false,
    hadChemoRadiotherapy: false,
    lastMenstrualPeriod: '',
    isPregnant: false,
    requiredTests: '',
    isOnIronVitamins: false,
    ironVitaminsDose: '',
    ironVitaminsDuration: '',
  });

  const [medications, setMedications] = useState<Medication[]>([
    { name: '', type: '', dose: '', duration: '' }
  ]);

  const generatePatientId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getTime()).slice(-4);
    return `PAT-${year}${month}${day}-${time}`;
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', type: '', dose: '', duration: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const clearForm = () => {
    setForm({
      patientId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      email: '',
      address: '',
      emergencyContact: '',
      insuranceNumber: '',
      nationalId: '',
      treatingDoctor: '',
      landline: '',
      fastingHours: '',
      isFasting: false,
      isDiabetic: false,
      isOnBloodThinner: false,
      isOnAntibiotics: false,
      isOnThyroidMedication: false,
      isOnKidneyTreatment: false,
      isOnLiverTreatment: false,
      isOnCholesterolMedication: false,
      isOnCortisone: false,
      hadContrastScan: false,
      hadBloodTransfusion: false,
      bloodTransfusionDate: '',
      hadSurgeries: false,
      hadChemoRadiotherapy: false,
      lastMenstrualPeriod: '',
      isPregnant: false,
      requiredTests: '',
      isOnIronVitamins: false,
      ironVitaminsDose: '',
      ironVitaminsDuration: '',
    });
    setMedications([{ name: '', type: '', dose: '', duration: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.patientId) {
      setForm(prev => ({ ...prev, patientId: generatePatientId() }));
    }
    
    const patientData = {
      ...form,
      dateOfBirth: new Date(form.dateOfBirth),
      gender: form.gender as 'male' | 'female' | 'other' | 'unknown',
      fastingHours: form.fastingHours ? parseInt(form.fastingHours) : null,
      bloodTransfusionDate: form.bloodTransfusionDate ? new Date(form.bloodTransfusionDate) : null,
      lastMenstrualPeriod: form.lastMenstrualPeriod ? new Date(form.lastMenstrualPeriod) : null,
      medications: medications.filter(med => med.name.trim() !== ''),
    };

    createPatient(patientData, {
      onSuccess: () => {
        clearForm();
        toast({
          title: "Patient registered successfully",
          description: `${form.firstName} ${form.lastName} has been added to the system.`,
        });
      },
      onError: (error) => {
        console.error('Registration failed:', error);
        toast({
          title: "Registration failed",
          description: "Please check all fields and try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={form.patientId}
                  onChange={(e) => setForm(prev => ({ ...prev, patientId: e.target.value }))}
                  placeholder="Auto-generated if empty"
                  disabled={isCreating}
                />
              </div>
              
              <div>
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  value={form.nationalId}
                  onChange={(e) => setForm(prev => ({ ...prev, nationalId: e.target.value }))}
                  placeholder="National ID number"
                  disabled={isCreating}
                />
              </div>

              <div>
                <Label htmlFor="insuranceNumber">Insurance Number</Label>
                <Input
                  id="insuranceNumber"
                  value={form.insuranceNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                  placeholder="Insurance number"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  disabled={isCreating}
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  required
                  value={form.dateOfBirth}
                  onChange={(e) => setForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  disabled={isCreating}
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={form.gender} onValueChange={(value) => setForm(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="unknown">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="treatingDoctor">Treating Doctor</Label>
              <Input
                id="treatingDoctor"
                value={form.treatingDoctor}
                onChange={(e) => setForm(prev => ({ ...prev, treatingDoctor: e.target.value }))}
                placeholder="Treating doctor name"
                disabled={isCreating}
              />
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Mobile</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Mobile number"
                  disabled={isCreating}
                />
              </div>
              
              <div>
                <Label htmlFor="landline">Landline</Label>
                <Input
                  id="landline"
                  type="tel"
                  value={form.landline}
                  onChange={(e) => setForm(prev => ({ ...prev, landline: e.target.value }))}
                  placeholder="Landline number"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full address"
                rows={3}
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={form.emergencyContact}
                onChange={(e) => setForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Emergency contact number"
                disabled={isCreating}
              />
            </div>
          </div>

          <Separator />

          {/* Pre-test Questionnaire */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pre-test Questionnaire</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fastingHours">Number of fasting hours</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fastingHours"
                    type="number"
                    value={form.fastingHours}
                    onChange={(e) => setForm(prev => ({ ...prev, fastingHours: e.target.value }))}
                    placeholder="0"
                    disabled={isCreating}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">hours</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFasting">Are you fasting?</Label>
                <Switch
                  id="isFasting"
                  checked={form.isFasting}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isFasting: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isDiabetic">Are you diabetic?</Label>
                <Switch
                  id="isDiabetic"
                  checked={form.isDiabetic}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isDiabetic: checked }))}
                  disabled={isCreating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isOnBloodThinner">Taking blood thinner medication?</Label>
                <Switch
                  id="isOnBloodThinner"
                  checked={form.isOnBloodThinner}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnBloodThinner: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isOnAntibiotics">Taking antibiotics?</Label>
                <Switch
                  id="isOnAntibiotics"
                  checked={form.isOnAntibiotics}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnAntibiotics: checked }))}
                  disabled={isCreating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isOnThyroidMedication">Taking thyroid medication?</Label>
                <Switch
                  id="isOnThyroidMedication"
                  checked={form.isOnThyroidMedication}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnThyroidMedication: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isOnKidneyTreatment">Taking kidney treatment?</Label>
                <Switch
                  id="isOnKidneyTreatment"
                  checked={form.isOnKidneyTreatment}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnKidneyTreatment: checked }))}
                  disabled={isCreating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isOnLiverTreatment">Taking liver treatment?</Label>
                <Switch
                  id="isOnLiverTreatment"
                  checked={form.isOnLiverTreatment}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnLiverTreatment: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isOnCholesterolMedication">Taking cholesterol medication?</Label>
                <Switch
                  id="isOnCholesterolMedication"
                  checked={form.isOnCholesterolMedication}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnCholesterolMedication: checked }))}
                  disabled={isCreating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isOnCortisone">Taking cortisone?</Label>
                <Switch
                  id="isOnCortisone"
                  checked={form.isOnCortisone}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnCortisone: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hadContrastScan">Had contrast scan/radioactive material (48h)?</Label>
                <Switch
                  id="hadContrastScan"
                  checked={form.hadContrastScan}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, hadContrastScan: checked }))}
                  disabled={isCreating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hadSurgeries">Had surgeries?</Label>
                <Switch
                  id="hadSurgeries"
                  checked={form.hadSurgeries}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, hadSurgeries: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hadBloodTransfusion">Had blood transfusion before?</Label>
                <Switch
                  id="hadBloodTransfusion"
                  checked={form.hadBloodTransfusion}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, hadBloodTransfusion: checked }))}
                  disabled={isCreating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hadChemoRadiotherapy">Had chemotherapy/radiotherapy?</Label>
                <Switch
                  id="hadChemoRadiotherapy"
                  checked={form.hadChemoRadiotherapy}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, hadChemoRadiotherapy: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>

            {form.hadBloodTransfusion && (
              <div>
                <Label htmlFor="bloodTransfusionDate">Date of blood transfusion</Label>
                <Input
                  id="bloodTransfusionDate"
                  type="date"
                  value={form.bloodTransfusionDate}
                  onChange={(e) => setForm(prev => ({ ...prev, bloodTransfusionDate: e.target.value }))}
                  disabled={isCreating}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Female-specific Questions */}
          {form.gender === 'female' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Female-specific Questions</h3>
              
              <div>
                <Label htmlFor="lastMenstrualPeriod">Date of first day of last period</Label>
                <Input
                  id="lastMenstrualPeriod"
                  type="date"
                  value={form.lastMenstrualPeriod}
                  onChange={(e) => setForm(prev => ({ ...prev, lastMenstrualPeriod: e.target.value }))}
                  disabled={isCreating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isPregnant">Are you pregnant?</Label>
                <Switch
                  id="isPregnant"
                  checked={form.isPregnant}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isPregnant: checked }))}
                  disabled={isCreating}
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Required Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Required Tests</h3>
            
            <div>
              <Label htmlFor="requiredTests">Required tests</Label>
              <Textarea
                id="requiredTests"
                value={form.requiredTests}
                onChange={(e) => setForm(prev => ({ ...prev, requiredTests: e.target.value }))}
                placeholder="List required tests..."
                rows={3}
                disabled={isCreating}
              />
            </div>
          </div>

          <Separator />

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Medications</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedication}
                disabled={isCreating}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {medications.map((medication, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Medication {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                      disabled={isCreating}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Medication name</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      placeholder="Medication name"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <Label>Type (Insulin/Pills)</Label>
                    <Select 
                      value={medication.type} 
                      onValueChange={(value) => updateMedication(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="insulin">Insulin</SelectItem>
                        <SelectItem value="pills">Pills</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Dose</Label>
                    <Input
                      value={medication.dose}
                      onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                      placeholder="Dose"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      placeholder="Duration"
                      disabled={isCreating}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Iron and Vitamins */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Iron and Vitamins</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="isOnIronVitamins">Are you taking iron or vitamins?</Label>
              <Switch
                id="isOnIronVitamins"
                checked={form.isOnIronVitamins}
                onCheckedChange={(checked) => setForm(prev => ({ ...prev, isOnIronVitamins: checked }))}
                disabled={isCreating}
              />
            </div>

            {form.isOnIronVitamins && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ironVitaminsDose">Dose</Label>
                  <Input
                    id="ironVitaminsDose"
                    value={form.ironVitaminsDose}
                    onChange={(e) => setForm(prev => ({ ...prev, ironVitaminsDose: e.target.value }))}
                    placeholder="Dose"
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <Label htmlFor="ironVitaminsDuration">Duration</Label>
                  <Input
                    id="ironVitaminsDuration"
                    value={form.ironVitaminsDuration}
                    onChange={(e) => setForm(prev => ({ ...prev, ironVitaminsDuration: e.target.value }))}
                    placeholder="Duration"
                    disabled={isCreating}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={clearForm}
              disabled={isCreating}
            >
              Clear All
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
