"use client";

import React from "react";
import { useFormContext, FieldValues, Path } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface SMTextAreaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
}

const SMTextArea = <T extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 4,
}: SMTextAreaProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SMTextArea;
