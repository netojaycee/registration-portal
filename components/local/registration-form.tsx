"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTransition, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BRANCHES } from "@/lib/utils/branches";
import { registerAction } from "@/lib/actions/registration.action";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "../ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    branch: z.string().min(1, "Branch is required"),
    gender: z.enum(["male", "female"]),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.email || data.phone, {
    message: "At least Email or Phone is required",
    path: ["email", "phone"],
  });

type FormData = z.infer<typeof schema>;

export default function RegistrationForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setSuccess(false);
    startTransition(async () => {
      const res = await registerAction(data);
      if (res && res.success) {
        setSuccess(true);
        toast.success("Registration successful!");
        reset();
      } else {
        toast.error((res as any)?.error || "Registration failed");
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-[95%] max-w-xl mx-auto mt-4 mb-4"
    >
      {/* Gradient border effect */}
      <div
        aria-hidden
        className="absolute -inset-1 rounded-2xl z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), #a5b4fc 40%, #f472b6 100%)",
          filter: "blur(8px)",
          opacity: 0.7,
        }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-4 border border-transparent"
        style={{
          boxShadow:
            "0 4px 32px 0 rgba(99,102,241,0.15), 0 1.5px 8px 0 rgba(244,114,182,0.10)",
        }}
      >
        <FieldGroup>
          <FieldSet>
            <div className="flex flex-col items-center mb-2">
              <Image
                src="/ydd.png"
                alt="Logo"
                width={80}
                height={80}
                className="mb-2 object-cover "
              />
              <FieldLegend className="text-lg font-semibold uppercase text-primary drop-shadow text-center">
                Abuja Area IYC 2026 Registration
              </FieldLegend>
            </div>
            <Separator className="my-0" />
            <FieldGroup>
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                  />
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.firstName
                        ? [{ message: errors.firstName.message }]
                        : []
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                  />
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.lastName
                        ? [{ message: errors.lastName.message }]
                        : []
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="branch">Branch</FieldLabel>
                  <Select
                    value={watch("branch")}
                    onValueChange={(val) => {
                      const event = { target: { name: "branch", value: val } };
                      register("branch").onChange(event);
                    }}
                  >
                    <SelectTrigger id="branch" className="w-full">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.branch ? [{ message: errors.branch.message }] : []
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Select
                    value={watch("gender")}
                    onValueChange={(val) => {
                      const event = { target: { name: "gender", value: val } };
                      register("gender").onChange(event);
                    }}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.gender ? [{ message: errors.gender.message }] : []
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">
                    Email{" "}
                    <span className="text-xs text-zinc-400">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.email ? [{ message: errors.email.message }] : []
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">
                    Phone{" "}
                    <span className="text-xs text-zinc-400">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.phone ? [{ message: errors.phone.message }] : []
                    }
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button
              type="submit"
              className="w-full mt-2 shadow-md shadow-primary/30"
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isPending ? "Registering..." : "Register"}
            </Button>
          </Field>
          {/* {success && (
          <div className="text-green-600 text-center font-medium">
            Registration successful!
          </div>
        )} */}
        </FieldGroup>
      </form>
    </motion.div>
  );
}
