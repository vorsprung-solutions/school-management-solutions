/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import SMForm from "@/components/form/SMForm"
import SMInput from "@/components/form/SMInput"
import SMSelect from "@/components/form/SMSelect"
import { Button } from "@/components/ui/button"
import useDomain from "@/hooks/useDomain"
import { useGetAllDepartmentByDomainQuery } from "@/redux/features/department/departmentApi"
import { useCreateStudentMutation } from "@/redux/features/student/studentApi"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { type ChangeEvent, useEffect, useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const createStudentValidationSchema = z.object({
  department: z.string().min(1, "Department is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  ephone: z
    .string()
    .min(9, "Emergency phone number must be at least 9 digits")
    .regex(/^\d+$/, "Emergency phone must contain only digits"),
  profilePicture: z.string().optional(),
  roll_no: z.string().min(1, "Roll number is required"),
  reg_no: z.string().min(1, "Registration number is required"),
  class: z.string().min(1, "Class is required"),
  group: z.string().optional(),
  session: z.string().min(1, "Session is required"),
  gender: z.enum(["Male", "Female"], { message: "Gender is required" }),
  dob: z.string().min(1, "Date of birth is required"),
  blood_group: z.string().min(1, "Blood group is required"),
})

type FormData = z.infer<typeof createStudentValidationSchema>

export default function CreateStudentPage() {
  const domain = useDomain()
  const router = useRouter()
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [createStudent, { isLoading }] = useCreateStudentMutation()

  const { data: departmentsData, isLoading: isDepartmentsLoading } = useGetAllDepartmentByDomainQuery(domain)

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const payload = new FormData()

    if (profilePictureFile) {
      payload.append("file", profilePictureFile)
    }

    const studentData = {
      ...formData,
      phone: Number.parseInt(formData.phone),
      ephone: Number.parseInt(formData.ephone),
      roll_no: Number.parseInt(formData.roll_no),
      reg_no: Number.parseInt(formData.reg_no),
      class: Number.parseInt(formData.class),
      session: Number.parseInt(formData.session),
      dob: new Date(formData.dob),
    }

    payload.append("data", JSON.stringify(studentData))
    try {
      const res: any = await createStudent(payload).unwrap();
      if (res?.success) {
        toast.success("Student created successfully");
        router.push("/admin/student");
      } else {
        toast.error(res?.message || "Failed to create student");
      }
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.error || err?.message;
      const errorMessage = apiMessage || "Failed to create student";
      toast.error(errorMessage);
    }
  }

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    setProfilePictureFile(file)
  }

  useEffect(() => {
    // no-op: handled in onSubmit via unwrap
  }, [])

  const departmentOptions =
    departmentsData?.data?.map((dept: any) => ({
      label: dept.name,
      value: dept._id,
    })) || []

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]

  const bloodGroupOptions = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ]

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">Create New Student</h3>
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <SMForm resolver={zodResolver(createStudentValidationSchema)} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Full Name" name="name" />
            <SMInput label="Email Address" name="email" type="email" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Phone Number" name="phone" />
            <SMInput label="Emergency Phone" name="ephone" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMSelect
              name="department"
              label="Department"
              placeholder="Select Department"
              options={departmentOptions}
            />
            <SMInput label="Roll Number" name="roll_no" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Registration Number" name="reg_no" />
            <SMInput label="Class" name="class" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Group (Optional)" name="group" />
            <SMInput label="Session" name="session" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMSelect name="gender" label="Gender" placeholder="Select Gender" options={genderOptions} />
            <SMSelect
              name="blood_group"
              label="Blood Group"
              placeholder="Select Blood Group"
              options={bloodGroupOptions}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Date of Birth" name="dob" type="date" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="profilePicture">
              Upload Profile Picture (Optional)
            </label>
            <input
              className="mt-2 block w-full rounded border-gray-300 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>

          <Button
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            size="lg"
            type="submit"
            disabled={isLoading || isDepartmentsLoading}
          >
            {isLoading ? "Creating..." : "Create Student"}
          </Button>
        </SMForm>
      </div>
    </div>
  )
}
