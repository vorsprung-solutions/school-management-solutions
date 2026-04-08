/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetAttendanceByIdQuery, useUpdateAttendanceMutation } from '@/redux/features/attendance/attendanceApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import React from 'react';

const updateAttendanceSchema = z.object({
  status: z.enum(["present", "absent", "late", "leave"]).describe("Please select attendance status"),
  date: z.string().min(1, "Please select a date"),
  remark: z.string().optional(),
});

type FormData = z.infer<typeof updateAttendanceSchema>;

const EditAttendancePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // Unwrap params using React.use()
  const { id } = React.use(params);

  const { data: attendanceResponse, isLoading, isError } = useGetAttendanceByIdQuery(id);
  const [updateAttendance, { isLoading: isUpdating }] = useUpdateAttendanceMutation();

  const attendance = attendanceResponse?.data;



  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(updateAttendanceSchema),
    defaultValues: {
      status: 'present',
      date: format(new Date(), 'yyyy-MM-dd'),
      remark: '',
    },
  });

  const watchedStatus = watch('status');

  // Update selected status when form value changes
  React.useEffect(() => {
    setSelectedStatus(watchedStatus);
  }, [watchedStatus]);

  // Set form values when attendance data is loaded
  React.useEffect(() => {
    if (attendance) {
      setValue('status', attendance.status);
      setValue('date', format(new Date(attendance.date), 'yyyy-MM-dd'));
      setValue('remark', attendance.remark || '');
      setSelectedStatus(attendance.status);
    }
  }, [attendance, setValue, setSelectedStatus]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateAttendance({ id, data }).unwrap();
      toast.success('Attendance updated successfully!');
      router.push('/admin/attendance');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update attendance');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      present: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Present' },
      absent: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Absent' },
      late: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Late' },
      leave: { color: 'bg-blue-100 text-blue-800', icon: UserCheck, label: 'Leave' },
    };
    return configs[status as keyof typeof configs];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError || !attendance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Attendance</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/attendance">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attendance
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Attendance</h1>
          <p className="text-gray-600">Update attendance record</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Update Attendance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Status Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status *</label>
                  <Select 
                    key={watchedStatus}
                    value={watchedStatus} 
                    onValueChange={(value) => setValue('status', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select attendance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Present</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="absent">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Absent</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="late">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span>Late</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="leave">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <span>Leave</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <Input
                    type="date"
                    {...register('date')}
                    className="w-full"
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                {/* Remark */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Remark</label>
                  <Textarea
                    {...register('remark')}
                    placeholder="Add any additional notes..."
                    rows={3}
                  />
                  {errors.remark && (
                    <p className="text-sm text-red-600">{errors.remark.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'Update Attendance'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="font-semibold">{attendance.student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Roll Number</p>
                <p className="font-semibold">{attendance.student.roll || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Class</p>
                <p>Class {attendance.student.class} - Session {attendance.student.session}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Department</p>
                <p>{attendance.department.name}</p>
              </div>
              {attendance.student.group && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Group</p>
                  <p>{attendance.student.group}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const config = getStatusConfig(attendance.status);
                const Icon = config.icon;
                return (
                  <div className="flex items-center gap-3">
                    <Badge className={config.color}>
                      <Icon className="w-4 h-4 mr-2" />
                      {config.label}
                    </Badge>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Selected Status Preview */}
          {selectedStatus && selectedStatus !== attendance.status && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  New Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const config = getStatusConfig(selectedStatus);
                  const Icon = config.icon;
                  return (
                    <div className="flex items-center gap-3">
                      <Badge className={config.color}>
                        <Icon className="w-4 h-4 mr-2" />
                        {config.label}
                      </Badge>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Update the attendance status</p>
              <p>• Modify the date if needed</p>
              <p>• Add or update remarks</p>
              <p>• Click &quot;Update Attendance&quot; to save</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditAttendancePage;
