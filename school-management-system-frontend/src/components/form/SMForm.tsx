"use client";

import React, { ReactNode } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  Resolver,
  FieldValues,
} from "react-hook-form";
import { Form } from "@/components/ui/form";

type TFormConfig<T extends FieldValues = FieldValues> = {
  defaultValues?: import("react-hook-form").DefaultValues<T>;
  resolver?: Resolver<T>;
};

type TFormProps<T extends FieldValues = FieldValues> = {
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
} & TFormConfig<T>;

const SMForm = <T extends FieldValues = FieldValues>({
  onSubmit,
  children,
  defaultValues,
  resolver,
}: TFormProps<T>) => {
  const methods = useForm<T>({
    defaultValues,
    resolver,
  });

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {children}
        </form>
      </Form>
    </FormProvider>
  );
};

export default SMForm;
