import { useState } from 'react';
import { usePatients } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    
    const patientData = {
      ...form,
      dateOfBirth: new Date(form.dateOfBirth),
      gender: form.gender as 'male' | 'female' | 'other' | 'unknown',
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
        });
        toast({
          title: "Patient registered successfully",
          description: `${form.firstName} ${form.lastName} has been added to the system.`,
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
