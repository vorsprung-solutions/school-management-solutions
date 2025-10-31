"use client";
import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMSelect from "@/components/form/SMSelect";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldValues } from "react-hook-form";
import z from "zod";

const page = () => {
  const defaultValues = {
    email: "abu@gmail.com",
    password: "sdfsdfds",
    role: "user" as "admin" | "user" | "guest", 
  };
  const registerSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    role: z.enum(["admin", "user", "guest"], {
      error: "Please select a role",
    }),
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };
  return (
    <>
      <SMForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        resolver={zodResolver(registerSchema)}
      >
        <SMInput type="text" name="email" label="Email" />
        <SMInput type="password" name="password" label="Passowrd:" />
        <SMSelect
          name="role"
          label="Role:"
          placeholder="Select your role"
          options={[
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
            { label: "Guest", value: "guest" },
          ]}
        />
        <Button type="submit" name="Hello" />
      </SMForm>
    </>
  );
};

export default page;
