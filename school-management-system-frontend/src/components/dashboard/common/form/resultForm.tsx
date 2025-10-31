"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IResult } from "../table/result-columns";
import { Card, CardContent } from "@/components/ui/card";
import { SubjectResultForm } from "./subjectResultForm";
import { useState } from "react";

const grades = ["A+", "A", "A-", "B", "C", "D", "F"];
const GradeEnumSchema = z.enum(grades);

type GradeEnum = z.infer<typeof GradeEnumSchema>;

export const SubjectResultSchema = z.object({
  subject: z.string(),
  marks: z.number(),
  grade: GradeEnumSchema,
  gpa: z.number(),
});

export const resultSchema = z.object({
  student: z.string(),
  exam_name: z.string(),
  year: z.number(),
  class: z.number(),
  session: z.number(),
  group: z.string().optional(),
  results: z.array(SubjectResultSchema),
  total_marks: z.number(),
  gpa: z.number(),
  grade: GradeEnumSchema,
  is_passed: z.boolean(),
});

export const ResultForm = ({
  data,
  onSubmit = () => {},
  disabled = false,
}: {
  data?: IResult;
  editMode?: boolean;
  onSubmit?(values: z.infer<typeof resultSchema>): void;
  disabled?: boolean;
}) => {
  const form = useForm<z.infer<typeof resultSchema>>({
    resolver: zodResolver(resultSchema),
    defaultValues: data || {
      student: "",
      exam_name: "",
      year: 2025,
      class: 10,
      session: 2025,
      total_marks: 0,
      gpa: 0,
      grade: "A" as GradeEnum,
      is_passed: true,
      results: [],
    },
  });

  const {
    fields: subjectResults,
    append,
    remove,
  } = useFieldArray({ control: form.control, name: "results" });

  const [showSubjectForm, setShowSubjectForm] = useState(false);

  const handleSubmit = (values: z.infer<typeof resultSchema>) => {
    onSubmit(values);
  };

  return (
    <div className="md:container md:mx-auto mb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <fieldset disabled={disabled} className="space-y-8 w-72 mt-6">
            <FormField
              control={form.control}
              name="student"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <FormControl>
                    <Input placeholder="Student" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exam_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Exam name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="Number"
                      placeholder="Year"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  items-between
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Input
                      type="Number"
                      placeholder="Class"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="session"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session</FormLabel>
                  <FormControl>
                    <Input
                      type="Number"
                      placeholder="Session"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <FormControl>
                    <Input placeholder="Group" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div>Subjectwise results</div>
              {subjectResults.map((each, index) => (
                <Card key={index}>
                  <CardContent className="flex justify-between items-between">
                    <div>{each.subject}</div>
                    <div>{each.marks}</div>
                    <Button variant="destructive" onClick={() => remove(index)}>
                      X
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {showSubjectForm ? (
                <SubjectResultForm
                  append={append}
                  cancel={() => {
                    setShowSubjectForm(false);
                  }}
                />
              ) : (
                <Button onClick={() => setShowSubjectForm(true)}>
                  Add Subject
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name="total_marks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Marks</FormLabel>
                  <FormControl>
                    <Input
                      type="Number"
                      placeholder="Total Marks"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPA</FormLabel>
                  <FormControl>
                    <Input
                      type="Number"
                      placeholder="GPA"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grades.map((grade: string) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_passed"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel>Passed</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
