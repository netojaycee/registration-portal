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
import { registrationSchema } from "@/lib/schemas/accreditation-schemas";

// const schema = z
//   .object({
//     firstName: z.string().min(1, "First name is required"),
//     lastName: z.string().min(1, "Last name is required"),
//     branch: z.string().min(1, "Branch is required"),
//     gender: z.enum(["male", "female"]),
//     memberType: z.enum(["member", "visitor"]),
//     email: z.string().email().optional().or(z.literal("")),
//     phone: z.string().optional().or(z.literal("")),
//   })
//   .refine((data) => data.email || data.phone, {
//     message: "At least Email or Phone is required",
//     path: ["email", "phone"],
//   });

type FormData = z.infer<typeof registrationSchema>;

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
    resolver: zodResolver(registrationSchema),
    defaultValues: { membershipStatus: "member" },
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
                {/* First Name */}
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
                {/* Last Name */}
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
                {/* Email */}
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
                {/* Username */}
                <Field>
                  <FieldLabel htmlFor="username">
                    Username{" "}
                    <span className="text-xs text-zinc-400">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="username"
                    {...register("username")}
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.username
                        ? [{ message: errors.username.message }]
                        : []
                    }
                  />
                </Field>
                {/* Phone Number */}
                <Field>
                  <FieldLabel htmlFor="phoneNumber">
                    Phone Number{" "}
                    <span className="text-xs text-zinc-400">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.phoneNumber
                        ? [{ message: errors.phoneNumber.message }]
                        : []
                    }
                  />
                </Field>
                {/* Gender */}
                <Field>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Select
                    value={watch("gender")}
                    onValueChange={(val) =>
                      register("gender").onChange({
                        target: { name: "gender", value: val },
                      })
                    }
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.gender ? [{ message: errors.gender.message }] : []
                    }
                  />
                </Field>
                {/* Marital Status */}
                <Field>
                  <FieldLabel htmlFor="maritalStatus">
                    Marital Status
                  </FieldLabel>
                  <Select
                    value={watch("maritalStatus")}
                    onValueChange={(val) =>
                      register("maritalStatus").onChange({
                        target: { name: "maritalStatus", value: val },
                      })
                    }
                  >
                    <SelectTrigger id="maritalStatus" className="w-full">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.maritalStatus
                        ? [{ message: errors.maritalStatus.message }]
                        : []
                    }
                  />
                </Field>
                {/* Membership Status */}
                <Field>
                  <FieldLabel htmlFor="membershipStatus">
                    Membership Status
                  </FieldLabel>
                  <Select
                    value={watch("membershipStatus")}
                    onValueChange={(val) =>
                      register("membershipStatus").onChange({
                        target: { name: "membershipStatus", value: val },
                      })
                    }
                  >
                    <SelectTrigger id="membershipStatus" className="w-full">
                      <SelectValue placeholder="Select membership status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.membershipStatus
                        ? [{ message: errors.membershipStatus.message }]
                        : []
                    }
                  />
                </Field>
                {/* Mode of Attendance */}
                <Field>
                  <FieldLabel htmlFor="modeOfAttendance">
                    Mode of Attendance
                  </FieldLabel>
                  <Select
                    value={watch("modeOfAttendance")}
                    onValueChange={(val) =>
                      register("modeOfAttendance").onChange({
                        target: { name: "modeOfAttendance", value: val },
                      })
                    }
                  >
                    <SelectTrigger id="modeOfAttendance" className="w-full">
                      <SelectValue placeholder="Select mode of attendance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cluster">Cluster</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.modeOfAttendance
                        ? [{ message: errors.modeOfAttendance.message }]
                        : []
                    }
                  />
                </Field>
                {/* Area (conditional) */}
                {watch("membershipStatus") === "member" && (
                  <Field>
                    <FieldLabel htmlFor="area">Area</FieldLabel>
                    <Select
                      value={watch("area")}
                      onValueChange={(val) =>
                        register("area").onChange({
                          target: { name: "area", value: val },
                        })
                      }
                    >
                      <SelectTrigger id="area" className="w-full">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abuja">Abuja</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      className="text-xs"
                      errors={
                        errors.area ? [{ message: errors.area.message }] : []
                      }
                    />
                  </Field>
                )}
                {/* Branch (conditional) */}
                {watch("membershipStatus") === "member" && (
                  <Field>
                    <FieldLabel htmlFor="branch">Branch</FieldLabel>
                    <Select
                      value={watch("branch")}
                      onValueChange={(val) =>
                        register("branch").onChange({
                          target: { name: "branch", value: val },
                        })
                      }
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
                        errors.branch
                          ? [{ message: errors.branch.message }]
                          : []
                      }
                    />
                  </Field>
                )}
                {/* Cluster (conditional) */}
                {watch("modeOfAttendance") === "cluster" && (
                  <Field>
                    <FieldLabel htmlFor="cluster">Cluster</FieldLabel>
                    <Select
                      value={watch("cluster")}
                      onValueChange={(val) =>
                        register("cluster").onChange({
                          target: { name: "cluster", value: val },
                        })
                      }
                    >
                      <SelectTrigger id="cluster" className="w-full">
                        <SelectValue placeholder="Select cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jabi">Jabi</SelectItem>
                      </SelectContent>
                    </Select>{" "}
                    <FieldError
                      className="text-xs"
                      errors={
                        errors.cluster
                          ? [{ message: errors.cluster.message }]
                          : []
                      }
                    />
                  </Field>
                )}
                {/* Accommodation */}
                <Field>
                  <FieldLabel htmlFor="accommodation">Accommodation</FieldLabel>
                  <Select
                    value={watch("accommodation")}
                    onValueChange={(val) =>
                      register("accommodation").onChange({
                        target: { name: "accommodation", value: val },
                      })
                    }
                  >
                    <SelectTrigger id="accommodation" className="w-full">
                      <SelectValue placeholder="Select accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.accommodation
                        ? [{ message: errors.accommodation.message }]
                        : []
                    }
                  />
                </Field>
                {/* Education Career */}
                <Field className="col-span-2">
                  <FieldLabel htmlFor="educationCareer">
                    Education/Career
                  </FieldLabel>
                  <Select
                    value={watch("educationCareer")}
                    onValueChange={(val) =>
                      register("educationCareer").onChange({
                        target: { name: "educationCareer", value: val },
                      })
                    }
                  >
                    <SelectTrigger id="educationCareer" className="w-full">
                      <SelectValue placeholder="Select education/career" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Secondary School Student">
                        Secondary School Student
                      </SelectItem>
                      <SelectItem value="Post-Secondary School Student">
                        Post-Secondary School Student
                      </SelectItem>
                      <SelectItem value="Undergraduate">
                        Undergraduate
                      </SelectItem>
                      <SelectItem value="Fresh Graduate/Post-Graduate">
                        Fresh Graduate/Post-Graduate
                      </SelectItem>
                      <SelectItem value="Career Man/Woman">
                        Career Man/Woman
                      </SelectItem>
                      <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                      <SelectItem value="Senior Colleague">
                        Senior Colleague
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError
                    className="text-xs"
                    errors={
                      errors.educationCareer
                        ? [{ message: errors.educationCareer.message }]
                        : []
                    }
                  />
                </Field>
                {/* Class Level (conditional) */}
                {watch("educationCareer") === "Secondary School Student" && (
                  <Field>
                    <FieldLabel htmlFor="classLevel">Class Level</FieldLabel>
                    <Select
                      value={watch("classLevel")}
                      onValueChange={(val) =>
                        register("classLevel").onChange({
                          target: { name: "classLevel", value: val },
                        })
                      }
                    >
                      <SelectTrigger id="classLevel" className="w-full">
                        <SelectValue placeholder="Select class level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JSS3">JSS3</SelectItem>
                        <SelectItem value="SS1">SS1</SelectItem>
                        <SelectItem value="SS2">SS2</SelectItem>
                        <SelectItem value="SS3">SS3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      className="text-xs"
                      errors={
                        errors.classLevel
                          ? [{ message: errors.classLevel.message }]
                          : []
                      }
                    />
                  </Field>
                )}
                {/* Class Division (conditional) */}
                {watch("educationCareer") === "Secondary School Student" && (
                  <Field>
                    <FieldLabel htmlFor="classDivision">
                      Class Division
                    </FieldLabel>
                    <Select
                      value={watch("classDivision")}
                      onValueChange={(val) =>
                        register("classDivision").onChange({
                          target: { name: "classDivision", value: val },
                        })
                      }
                    >
                      <SelectTrigger id="classDivision" className="w-full">
                        <SelectValue placeholder="Select class division" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Art">Art</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      className="text-xs"
                      errors={
                        errors.classDivision
                          ? [{ message: errors.classDivision.message }]
                          : []
                      }
                    />
                  </Field>
                )}
                {/* Faculty (conditional) */}
                {watch("educationCareer") === "Undergraduate" && (
                  <Field>
                    <FieldLabel htmlFor="faculty">Faculty</FieldLabel>
                    <Input
                      id="faculty"
                      {...register("faculty")}
                      placeholder="Enter faculty/department"
                    />
                    <FieldError
                      className="text-xs"
                      errors={
                        errors.faculty
                          ? [{ message: errors.faculty.message }]
                          : []
                      }
                    />
                  </Field>
                )}
                {/* Job (conditional) */}
                {(watch("educationCareer") === "Career Man/Woman" ||
                  watch("educationCareer") === "Entrepreneur") && (
                  <Field>
                    <FieldLabel htmlFor="job">Job</FieldLabel>
                    <Input
                      id="job"
                      {...register("job")}
                      placeholder="Enter job"
                    />
                    <FieldError
                      className="text-xs"
                      errors={
                        errors.job ? [{ message: errors.job.message }] : []
                      }
                    />
                  </Field>
                )}
                {/* Address (conditional) */}
                {watch("membershipStatus") === "visitor" && (
                  <Field>
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Enter address"
                    />
                    <FieldError
                      className="text-xs"
                      errors={
                        errors.address
                          ? [{ message: errors.address.message }]
                          : []
                      }
                    />
                  </Field>
                )}
              </div>
            </FieldGroup>

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
          </FieldSet>
        </FieldGroup>
      </form>
    </motion.div>
  );
}
