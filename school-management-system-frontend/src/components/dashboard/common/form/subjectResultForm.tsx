"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubjectResultSchema } from "./resultForm";
import { Card, CardContent } from "@/components/ui/card";

const grades = ["A+", "A", "A-", "B", "C", "D", "F"];

export const SubjectResultForm = ({
  append,
  cancel,
}: {
  append(value: z.infer<typeof SubjectResultSchema>): void;
  cancel(): void;
}) => {
  const form = useForm<z.infer<typeof SubjectResultSchema>>({
    resolver: zodResolver(SubjectResultSchema),
    defaultValues: {
      subject: "",
      gpa: 5.0,
      grade: "A",
      marks: 100,
    },
  });

  const handleSubmit = (values: z.infer<typeof SubjectResultSchema>) => {
    append(values);
  };

  return (
    <Card>
      <CardContent>
        <div className="text-2xl font-bold text-primary">Subject Result</div>

        <Form {...form}>
          <fieldset className="space-y-8 w-72 mt-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marks</FormLabel>
                  <FormControl>
                    <Input
                      type="Number"
                      placeholder="Marks"
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

            <div className="flex gap-4">
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                Add
              </Button>
              <Button onClick={cancel} variant="destructive">
                Cancel
              </Button>
            </div>
          </fieldset>
        </Form>
      </CardContent>
    </Card>
  );
};
