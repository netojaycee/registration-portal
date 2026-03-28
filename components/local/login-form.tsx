"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { loginUserAction } from "@/lib/actions/user.action";

const schema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setSuccess(false);
    startTransition(async () => {
      const res = await loginUserAction(data);
      if (res && res.success) {
        setSuccess(true);
        toast.success("Login successful!");
        reset();
        router.push("/admin");
      } else {
        toast.error((res as any)?.error || "Login failed");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[95%] max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 mt-16 mb-8"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Login</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-6">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                <FieldError
                  className="text-xs"
                  errors={errors.email ? [{ message: errors.email.message }] : []}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <FieldError
                  className="text-xs"
                  errors={errors.password ? [{ message: errors.password.message }] : []}
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </Field>
        {/* {success && (
          <div className="text-green-600 text-center font-medium animate-pulse mt-4">
            Login successful!
          </div>
        )} */}
      </FieldGroup>
    </form>
  );
}
