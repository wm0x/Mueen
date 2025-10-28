"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateUserInfo } from "../../../../../schema/users";
import { UpdateUser } from "@/app/server/action/UpdateUser";

export default function CardInformation({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof UpdateUserInfo>>({
    resolver: zodResolver(UpdateUserInfo),
    defaultValues: {
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof UpdateUserInfo>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await UpdateUser(values);
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success) {
        setSuccess(data.success);
      }
    });
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-[#0e0e0e] text-white">
      <Card
        className="p-0 max-w-sm w-full shadow-none border border-transparent bg-transparent rounded-xl -translate-y-30"
        dir="rtl"
      >
        <div className=" my-auto mx-auto mb-10 relative group w-24 h-24 rounded-full overflow-hidden border-4 border-[#1B3A34] shadow-lg cursor-pointer">
          <img
            src={
              "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
            }
            alt="User Avatar"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader className="border-b border-white/20 p-4 -translate-y-12">
          <CardTitle className="text-white text-center">معلوماتك</CardTitle>
          <CardDescription className="text-white/50 text-center mt-1">
            لتعديل بياناتك، اضغط على الحقول وعدّل ما ترغب به
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-4 -translate-y-12">
              {error && (
                <p className="text-red-500 text-center font-bold mb-8">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-500 text-center font-bold mb-8">
                  {success}
                </p>
              )}

              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabelInputContainer>
                          <Label htmlFor="fullName" className="text-white">
                            الاسم
                          </Label>
                          <Input
                            {...field}
                            id="fullName"
                            className="bg-[#1d1d1d] text-white"
                          />
                        </LabelInputContainer>
                      </FormControl>
                      <FormMessage className="text-[#e57373]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabelInputContainer>
                          <Label htmlFor="email" className="text-white">
                            البريد الإلكتروني
                          </Label>
                          <Input
                            {...field}
                            id="email"
                            className="bg-[#1d1d1d] text-white"
                          />
                        </LabelInputContainer>
                      </FormControl>
                      <FormMessage className="text-[#e57373]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    const [passwordStrength, setPasswordStrength] = useState(0);

                    const calculatePasswordStrength = (password: string) => {
                      let strength = 0;
                      if (password.length >= 8) strength += 1;
                      if (/[A-Z]/.test(password)) strength += 1; // حرف كبير
                      if (/[0-9]/.test(password)) strength += 1; // رقم
                      if (/[\W_]/.test(password)) strength += 1; // رمز خاص
                      return strength;
                    };

                    const onChange = (
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      field.onChange(e);
                      setPasswordStrength(
                        calculatePasswordStrength(e.target.value)
                      );
                    };
                    const strengthColors = [
                      "bg-red-500",
                      "bg-yellow-400",
                      "bg-green-400",
                      "bg-green-600",
                    ];

                    return (
                      <FormItem>
                        <FormControl>
                          <LabelInputContainer>
                            <Label htmlFor="password" className="text-white">
                              كلمة المرور الجديدة
                            </Label>
                            <div className="relative">
                              <Input
                                {...field}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="bg-[#1d1d1d] text-white "
                                autoComplete="new-password"
                                onChange={onChange}
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 left-2 flex items-center text-gray-400 hover:text-white"
                                tabIndex={-1}
                                aria-label={
                                  showPassword
                                    ? "إخفاء كلمة المرور"
                                    : "إظهار كلمة المرور"
                                }
                              >
                                {showPassword ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.246-3.383m1.927-1.615A10.04 10.04 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-1.482 2.71M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 3l18 18"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                            <div className="mt-2 h-2 w-full rounded bg-gray-700">
                              <div
                                className={`${
                                  strengthColors[passwordStrength - 1] ||
                                  "bg-gray-600"
                                } h-2 rounded transition-all duration-300`}
                                style={{
                                  width: `${(passwordStrength / 4) * 100}%`,
                                }}
                              />
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              كلمة المرور يفضل أن تكون 8 أحرف أو أكثر وتتضمن
                              حروفًا وأرقامًا ورموزًا
                            </p>
                          </LabelInputContainer>
                        </FormControl>
                        <FormMessage className="text-[#e57373]" />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col p-4 border-white/20 space-y-4 -translate-y-8">
              <Button
                disabled={!form.formState.isDirty || isPending}
                className={cn(
                  "relative z-10 w-full rounded-full bg-gradient-to-br from-[#1B3A34] to-[#4caf50] p-[2px] shadow-xl transition-transform duration-300 ease-out",
                  (!form.formState.isDirty || isPending) &&
                    "opacity-50 cursor-not-allowed"
                )}
                type="submit"
              >
                <span className="relative inline-flex w-full items-center justify-center rounded-full bg-[#0e0e0e]/90 px-6 py-2 text-sm font-semibold text-white backdrop-blur-md hover:shadow-[0_0_14px_#4caf50aa] transition-all duration-300">
                  حفظ التعديلات
                  <span className="absolute inset-0 z-[-1] rounded-full opacity-40 blur-lg bg-[conic-gradient(at_top_left,_#4caf50_0%,_#1B3A34_100%)] animate-spin-slow" />
                </span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
