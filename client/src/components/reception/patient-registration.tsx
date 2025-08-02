
import { useState } from 'react';
import { usePatients } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    mobile: '',
    landline: '',
    fastingHours: '',
    isFasting: '',
    isDiabetic: '',
    isBloodThinner: '',
    isAntibiotics: '',
    isThyroid: '',
    isKidneyTreatment: '',
    isLiverTreatment: '',
    isCholesterol: '',
    isCortisone: '',
    hasContrastScan: '',
    hasBloodTransfusion: '',
    bloodTransfusionDate: '',
    hasSurgeries: '',
    hasChemoRadio: '',
    lastPeriodDate: '',
    isPregnant: '',
    requiredTests: '',
    medicationName1: '',
    insulinPills: '',
    medicationType1: '',
    dose1: '',
    duration1: '',
    medicationName2: '',
    previousDose: '',
    previousDuration: '',
    antibioticName: '',
    antibioticDays: '',
    antibioticDose: '',
    medicationName3: '',
    medicationName4: '',
    medicationName5: '',
    isIronVitamins: '',
    ironVitaminDose: '',
    ironVitaminDuration: '',
  });

  const generatePatientId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getTime()).slice(-4);
    return `PAT-${year}${month}${day}-${time}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.patientId) {
      setForm(prev => ({ ...prev, patientId: generatePatientId() }));
    }
    
    const medicalHistory = {
      nationalId: form.nationalId,
      treatingDoctor: form.treatingDoctor,
      mobile: form.mobile,
      landline: form.landline,
      fastingHours: form.fastingHours,
      isFasting: form.isFasting,
      isDiabetic: form.isDiabetic,
      isBloodThinner: form.isBloodThinner,
      isAntibiotics: form.isAntibiotics,
      isThyroid: form.isThyroid,
      isKidneyTreatment: form.isKidneyTreatment,
      isLiverTreatment: form.isLiverTreatment,
      isCholesterol: form.isCholesterol,
      isCortisone: form.isCortisone,
      hasContrastScan: form.hasContrastScan,
      hasBloodTransfusion: form.hasBloodTransfusion,
      bloodTransfusionDate: form.bloodTransfusionDate,
      hasSurgeries: form.hasSurgeries,
      hasChemoRadio: form.hasChemoRadio,
      lastPeriodDate: form.lastPeriodDate,
      isPregnant: form.isPregnant,
      requiredTests: form.requiredTests,
      medications: {
        medicationName1: form.medicationName1,
        insulinPills: form.insulinPills,
        medicationType1: form.medicationType1,
        dose1: form.dose1,
        duration1: form.duration1,
        medicationName2: form.medicationName2,
        previousDose: form.previousDose,
        previousDuration: form.previousDuration,
        antibioticName: form.antibioticName,
        antibioticDays: form.antibioticDays,
        antibioticDose: form.antibioticDose,
        medicationName3: form.medicationName3,
        medicationName4: form.medicationName4,
        medicationName5: form.medicationName5,
        isIronVitamins: form.isIronVitamins,
        ironVitaminDose: form.ironVitaminDose,
        ironVitaminDuration: form.ironVitaminDuration,
      }
    };

    const patientData = {
      ...form,
      dateOfBirth: new Date(form.dateOfBirth),
      gender: form.gender as 'male' | 'female' | 'other' | 'unknown',
      medicalHistory: medicalHistory,
    };

    createPatient(patientData, {
      onSuccess: () => {
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
          mobile: '',
          landline: '',
          fastingHours: '',
          isFasting: '',
          isDiabetic: '',
          isBloodThinner: '',
          isAntibiotics: '',
          isThyroid: '',
          isKidneyTreatment: '',
          isLiverTreatment: '',
          isCholesterol: '',
          isCortisone: '',
          hasContrastScan: '',
          hasBloodTransfusion: '',
          bloodTransfusionDate: '',
          hasSurgeries: '',
          hasChemoRadio: '',
          lastPeriodDate: '',
          isPregnant: '',
          requiredTests: '',
          medicationName1: '',
          insulinPills: '',
          medicationType1: '',
          dose1: '',
          duration1: '',
          medicationName2: '',
          previousDose: '',
          previousDuration: '',
          antibioticName: '',
          antibioticDays: '',
          antibioticDose: '',
          medicationName3: '',
          medicationName4: '',
          medicationName5: '',
          isIronVitamins: '',
          ironVitaminDose: '',
          ironVitaminDuration: '',
        });
        toast({
          title: "Patient registered successfully",
          description: `${form.firstName} ${form.lastName} has been added to the system.`,
        });
      },
    });
  };

  const YesNoRadioGroup = ({ name, label, value, onChange }: { name: string, label: string, value: string, onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${name}-yes`} />
          <Label htmlFor={`${name}-yes`}>Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${name}-no`} />
          <Label htmlFor={`${name}-no`}>No</Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Doctor's name"
                disabled={isCreating}
              />
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm(prev => ({ ...prev, mobile: e.target.value }))}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Phone number"
                  disabled={isCreating}
                />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <Separator />

          {/* Pre-Test Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pre-Test Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fastingHours">Number of fasting hours</Label>
                <div className="flex items-center space-x-2">
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
              
              <YesNoRadioGroup
                name="fasting"
                label="Are you fasting?"
                value={form.isFasting}
                onChange={(value) => setForm(prev => ({ ...prev, isFasting: value }))}
              />
            </div>
          </div>

          <Separator />

          {/* Medical History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YesNoRadioGroup
                name="diabetic"
                label="Are you diabetic?"
                value={form.isDiabetic}
                onChange={(value) => setForm(prev => ({ ...prev, isDiabetic: value }))}
              />
              
              <YesNoRadioGroup
                name="bloodThinner"
                label="Are you taking blood thinner medication?"
                value={form.isBloodThinner}
                onChange={(value) => setForm(prev => ({ ...prev, isBloodThinner: value }))}
              />
              
              <YesNoRadioGroup
                name="antibiotics"
                label="Are you taking antibiotics?"
                value={form.isAntibiotics}
                onChange={(value) => setForm(prev => ({ ...prev, isAntibiotics: value }))}
              />
              
              <YesNoRadioGroup
                name="thyroid"
                label="Are you taking thyroid medication?"
                value={form.isThyroid}
                onChange={(value) => setForm(prev => ({ ...prev, isThyroid: value }))}
              />
              
              <YesNoRadioGroup
                name="kidneyTreatment"
                label="Are you taking kidney treatment?"
                value={form.isKidneyTreatment}
                onChange={(value) => setForm(prev => ({ ...prev, isKidneyTreatment: value }))}
              />
              
              <YesNoRadioGroup
                name="liverTreatment"
                label="Are you taking liver treatment?"
                value={form.isLiverTreatment}
                onChange={(value) => setForm(prev => ({ ...prev, isLiverTreatment: value }))}
              />
              
              <YesNoRadioGroup
                name="cholesterol"
                label="Are you taking cholesterol medication?"
                value={form.isCholesterol}
                onChange={(value) => setForm(prev => ({ ...prev, isCholesterol: value }))}
              />
              
              <YesNoRadioGroup
                name="cortisone"
                label="Are you taking cortisone?"
                value={form.isCortisone}
                onChange={(value) => setForm(prev => ({ ...prev, isCortisone: value }))}
              />
              
              <YesNoRadioGroup
                name="contrastScan"
                label="Have you had a contrast scan or radioactive material within the last 48 hours?"
                value={form.hasContrastScan}
                onChange={(value) => setForm(prev => ({ ...prev, hasContrastScan: value }))}
              />
              
              <YesNoRadioGroup
                name="bloodTransfusion"
                label="Have you received a blood transfusion before?"
                value={form.hasBloodTransfusion}
                onChange={(value) => setForm(prev => ({ ...prev, hasBloodTransfusion: value }))}
              />
              
              <YesNoRadioGroup
                name="surgeries"
                label="Have you undergone any surgeries?"
                value={form.hasSurgeries}
                onChange={(value) => setForm(prev => ({ ...prev, hasSurgeries: value }))}
              />
              
              <YesNoRadioGroup
                name="chemoRadio"
                label="Have you received chemotherapy or radiotherapy?"
                value={form.hasChemoRadio}
                onChange={(value) => setForm(prev => ({ ...prev, hasChemoRadio: value }))}
              />
            </div>

            {form.hasBloodTransfusion === 'yes' && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastPeriodDate">What is the date of the first day of your last period?</Label>
                <Input
                  id="lastPeriodDate"
                  type="date"
                  value={form.lastPeriodDate}
                  onChange={(e) => setForm(prev => ({ ...prev, lastPeriodDate: e.target.value }))}
                  disabled={isCreating}
                />
              </div>
              
              {form.gender === 'female' && (
                <YesNoRadioGroup
                  name="pregnant"
                  label="For females: Are you pregnant?"
                  value={form.isPregnant}
                  onChange={(value) => setForm(prev => ({ ...prev, isPregnant: value }))}
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Tests and Medications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Tests & Medications</h3>
            <div>
              <Label htmlFor="requiredTests">Required tests</Label>
              <Textarea
                id="requiredTests"
                value={form.requiredTests}
                onChange={(e) => setForm(prev => ({ ...prev, requiredTests: e.target.value }))}
                placeholder="List required tests"
                rows={3}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium">Medication Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicationName1">Medication name</Label>
                  <Input
                    id="medicationName1"
                    value={form.medicationName1}
                    onChange={(e) => setForm(prev => ({ ...prev, medicationName1: e.target.value }))}
                    placeholder="Medication name"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="insulinPills">Insulin / Pills</Label>
                  <Select value={form.insulinPills} onValueChange={(value) => setForm(prev => ({ ...prev, insulinPills: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insulin">Insulin</SelectItem>
                      <SelectItem value="pills">Pills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="medicationType1">Type of medication</Label>
                  <Input
                    id="medicationType1"
                    value={form.medicationType1}
                    onChange={(e) => setForm(prev => ({ ...prev, medicationType1: e.target.value }))}
                    placeholder="Type"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dose1">Dose</Label>
                  <Input
                    id="dose1"
                    value={form.dose1}
                    onChange={(e) => setForm(prev => ({ ...prev, dose1: e.target.value }))}
                    placeholder="Dose"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration1">Duration</Label>
                  <Input
                    id="duration1"
                    value={form.duration1}
                    onChange={(e) => setForm(prev => ({ ...prev, duration1: e.target.value }))}
                    placeholder="Duration"
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="medicationName2">Medication name</Label>
                  <Input
                    id="medicationName2"
                    value={form.medicationName2}
                    onChange={(e) => setForm(prev => ({ ...prev, medicationName2: e.target.value }))}
                    placeholder="Medication name"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="previousDose">Previous dose</Label>
                  <Input
                    id="previousDose"
                    value={form.previousDose}
                    onChange={(e) => setForm(prev => ({ ...prev, previousDose: e.target.value }))}
                    placeholder="Previous dose"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="previousDuration">Duration</Label>
                  <Input
                    id="previousDuration"
                    value={form.previousDuration}
                    onChange={(e) => setForm(prev => ({ ...prev, previousDuration: e.target.value }))}
                    placeholder="Duration"
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="antibioticName">Antibiotic name</Label>
                  <Input
                    id="antibioticName"
                    value={form.antibioticName}
                    onChange={(e) => setForm(prev => ({ ...prev, antibioticName: e.target.value }))}
                    placeholder="Antibiotic name"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="antibioticDays">Number of days</Label>
                  <Input
                    id="antibioticDays"
                    type="number"
                    value={form.antibioticDays}
                    onChange={(e) => setForm(prev => ({ ...prev, antibioticDays: e.target.value }))}
                    placeholder="Days"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="antibioticDose">Dose</Label>
                  <Input
                    id="antibioticDose"
                    value={form.antibioticDose}
                    onChange={(e) => setForm(prev => ({ ...prev, antibioticDose: e.target.value }))}
                    placeholder="Dose"
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="medicationName3">Medication name</Label>
                  <Input
                    id="medicationName3"
                    value={form.medicationName3}
                    onChange={(e) => setForm(prev => ({ ...prev, medicationName3: e.target.value }))}
                    placeholder="Medication name"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="medicationName4">Medication name</Label>
                  <Input
                    id="medicationName4"
                    value={form.medicationName4}
                    onChange={(e) => setForm(prev => ({ ...prev, medicationName4: e.target.value }))}
                    placeholder="Medication name"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <Label htmlFor="medicationName5">Medication name</Label>
                  <Input
                    id="medicationName5"
                    value={form.medicationName5}
                    onChange={(e) => setForm(prev => ({ ...prev, medicationName5: e.target.value }))}
                    placeholder="Medication name"
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <YesNoRadioGroup
                  name="ironVitamins"
                  label="Are you taking iron or vitamins?"
                  value={form.isIronVitamins}
                  onChange={(value) => setForm(prev => ({ ...prev, isIronVitamins: value }))}
                />
                
                {form.isIronVitamins === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ironVitaminDose">Dose</Label>
                      <Input
                        id="ironVitaminDose"
                        value={form.ironVitaminDose}
                        onChange={(e) => setForm(prev => ({ ...prev, ironVitaminDose: e.target.value }))}
                        placeholder="Dose"
                        disabled={isCreating}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ironVitaminDuration">Duration</Label>
                      <Input
                        id="ironVitaminDuration"
                        value={form.ironVitaminDuration}
                        onChange={(e) => setForm(prev => ({ ...prev, ironVitaminDuration: e.target.value }))}
                        placeholder="Duration"
                        disabled={isCreating}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setForm({
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
                mobile: '',
                landline: '',
                fastingHours: '',
                isFasting: '',
                isDiabetic: '',
                isBloodThinner: '',
                isAntibiotics: '',
                isThyroid: '',
                isKidneyTreatment: '',
                isLiverTreatment: '',
                isCholesterol: '',
                isCortisone: '',
                hasContrastScan: '',
                hasBloodTransfusion: '',
                bloodTransfusionDate: '',
                hasSurgeries: '',
                hasChemoRadio: '',
                lastPeriodDate: '',
                isPregnant: '',
                requiredTests: '',
                medicationName1: '',
                insulinPills: '',
                medicationType1: '',
                dose1: '',
                duration1: '',
                medicationName2: '',
                previousDose: '',
                previousDuration: '',
                antibioticName: '',
                antibioticDays: '',
                antibioticDose: '',
                medicationName3: '',
                medicationName4: '',
                medicationName5: '',
                isIronVitamins: '',
                ironVitaminDose: '',
                ironVitaminDuration: '',
              })}
              disabled={isCreating}
            >
              Clear
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
