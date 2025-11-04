"use client";
import React, { useState, useCallback, useTransition } from "react";
import Stepper, { Step } from "./Stepper";
import { Input } from "../input";
import ReactCountryFlag from "react-country-flag";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useRouter } from "next/navigation";

import {
  LoginUser as LoginSchema,
  SignInUser as SignInSchema,
} from "../../../../schema/Authentication";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { login } from "@/app/server/action/loginAction";
import { LoaderTwo } from "../loader";

const EmailCheckSchema = z.object({
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صالح" }),
});

function LoginForm() {
  const router = useRouter();
  const [emailChecked, setEmailChecked] = useState<string>("");
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loginError, setLoginError] = useState<string | undefined>("");
  const [signInError, setSignInError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const emailForm = useForm<z.infer<typeof EmailCheckSchema>>({
    resolver: zodResolver(EmailCheckSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  const isEmailValid = emailForm.formState.isValid;

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      password: "",
    },
    mode: "onChange",
  });

  const isSignInFormValid = signInForm.formState.isValid;

  const onLoginSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoginError("");
    setSuccess("");

    startTransition(async () => {
      const data = await login(values);

      if (data?.error) {
        setLoginError(data.error);
        return;
      }

      if (data?.success) {
        router.push(data.redirectUrl);
      }
    });
  };

  // User submission
  const onSignInSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setSignInError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        setSignInError(data?.error || "حدث خطأ أثناء إنشاء الحساب.");
        return;
      }

      const loginData = await login({
        email: values.email,
        password: values.password,
      });

      if (loginData?.success) {
        router.push(loginData.redirectUrl);
      } else {
        setSignInError(
          loginData?.error || "تم إنشاء الحساب، ولكن فشل تسجيل الدخول التلقائي."
        );
      }
    } catch (err) {
      console.error(err);
      setSignInError("فشل الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneInputFilter = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      fieldChange: (...event: any[]) => void
    ) => {
      const value = e.target.value;
      const filteredValue = value.replace(/\D/g, "");

      let limitedValue = filteredValue.slice(0, 9);
      if (limitedValue.length === 1 && limitedValue === "0") {
        limitedValue = "";
      }

      fieldChange(limitedValue);
    },
    []
  );

  const checkEmail = useCallback(
    async (currentEmail: string) => {
      setLoading(true);
      loginForm.setValue("email", currentEmail);
      signInForm.setValue("email", currentEmail);
      setEmailChecked(currentEmail);
      startTransition(async () => {
        try {
          const res = await fetch("/api/users/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentEmail }),
          });

          let data;
          let errorMessage = "فشل التحقق من البريد. يرجى مراجعة الاتصال.";

          if (!res.ok) {
            try {
              const errorJson = await res.json();
              errorMessage =
                errorJson.error || `خطأ في الخادم (الحالة: ${res.status})`;
            } catch (e) {
              const errorText = await res.text();
              console.error(
                "Received non-JSON error:",
                errorText.substring(0, 100) + "..."
              );
              errorMessage = `حدث خطأ غير متوقع في الخادم. (الحالة: ${res.status})`;
            }

            console.log("❌ Fetch returned error:", errorMessage);
            return;
          }

          data = await res.json();

          setEmailExists(data.exists);

          setCurrentStep(2);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      });
    },
    [isEmailValid, loginForm, signInForm]
  );

  const nextStep = useCallback(async () => {
    if (loading) {
      return;
    }

    if (currentStep === 1) {
      const isValid = await emailForm.trigger("email");
      if (isValid) {
        await checkEmail(emailForm.getValues("email"));
      }
    } else if (currentStep === 2) {
      if (emailExists === true) {
        loginForm.handleSubmit(onLoginSubmit)();
      } else if (emailExists === false) {
        signInForm.handleSubmit(onSignInSubmit)();
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [
    currentStep,
    loading,
    emailExists,
    emailForm,
    loginForm,
    signInForm,
    checkEmail,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextStep();
    }
  };

  const isStep2ButtonDisabled =
    loading ||
    (emailExists === true && !loginForm.formState.isValid) ||
    (emailExists === false && !isSignInFormValid);

  return (
    <div
      className="dark:bg-neutral-950 flex justify-center items-center overflow-hidden h-screen mx-auto my-auto"
      onKeyDown={handleKeyDown}
    >
      <Stepper
        currentStep={currentStep}
        backButtonText="للخلف"
        nextButtonText={
          emailExists === true && currentStep === 2
            ? "تسجيل الدخول"
            : emailExists === false && currentStep === 2
            ? "إنشاء حساب"
            : "التالي"
        }
        dir="rtl"
        onStepChange={(step) => setCurrentStep(step)}
        onFinalStepCompleted={() => console.log("All steps completed!")}
        nextButtonProps={{
          onClick: async (e) => {
            e.preventDefault();
            nextStep();
          },
          disabled:
            loading ||
            (currentStep === 1 && !isEmailValid) ||
            (currentStep === 2 && isStep2ButtonDisabled),
        }}
      >
        <Step>
          <h2 className="text-lg font-semibold mb-2">ادخل بريدك الإلكتروني</h2>
          <Form {...emailForm}>
            <FormField
              disabled={isPending}
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="example@email.com"
                      type="email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setEmailExists(null);
                        setEmailChecked("");
                      }}
                    />
                  </FormControl>
                  <FormMessage
                    dir="rtl"
                    className="text-red-500 text-sm mt-2"
                  />
                </FormItem>
              )}
            />
          </Form>
        </Step>

        <Step>
          {loading && (
            <div className="flex items-center justify-center w-full h-full mx-auto my-auto">
              {" "}
              <LoaderTwo text={"......"} />{" "}
            </div>
          )}

          {emailExists !== null && !loading ? (
            <>
              {emailExists === true && (
                <Form {...loginForm}>
                  <h2 className="text-lg font-semibold mb-2">
                    أدخل كلمة المرور لتسجيل الدخول لـ: {emailChecked}
                  </h2>
                  <FormField
                    disabled={isPending}
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="كلمة المرور"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        {/* هذه رسالة خطأ التحقق من Zod */}
                        <FormMessage
                          dir="rtl"
                          className="text-red-500 text-sm mt-2"
                        />
                      </FormItem>
                    )}
                  />

                  {loginError && (
                    <div className="mb-3">
                      <div
                        dir="rtl"
                        className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300"
                      >
                        <p className="font-semibold text-sm">{loginError}</p>
                      </div>
                    </div>
                  )}
                </Form>
              )}
              {emailExists === false && (
                <Form {...signInForm}>
                  <h2 className="text-lg font-semibold mb-2">
                    لم يتم العثور على البريد - إنشاء حساب لـ: {emailChecked}
                  </h2>
                  <div className="flex flex-col w-full">
                    <FormField
                      disabled={isPending}
                      control={signInForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          {" "}
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="الاسم الكامل"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isPending}
                      control={signInForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          {" "}
                          <div className="flex items-center w-full">
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-r-md px-3 bg-gray-50 dark:bg-gray-800 h-10">
                              <ReactCountryFlag
                                countryCode="SA"
                                svg
                                style={{ width: "20px", height: "20px" }}
                                title="Saudi Arabia"
                              />
                              <span className="ml-2 mr-1 text-sm text-gray-600 dark:text-gray-400">
                                +966
                              </span>
                            </div>
                            <div className=" w-full">
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="رقم الجوال (9 أرقام، لا يبدأ بـ 0)"
                                  className="rounded-r-none border-r-0"
                                  dir="rtl"
                                  maxLength={9}
                                  value={field.value}
                                  onChange={(e) =>
                                    handlePhoneInputFilter(e, field.onChange)
                                  }
                                  onBlur={field.onBlur}
                                />
                              </FormControl>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isPending}
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => {
                        const [showPassword, setShowPassword] = useState(false);

                        return (
                          <FormItem className="mb-6">
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="أنشئ كلمة مرور"
                                  dir="rtl"
                                  {...field}
                                  className="pr-10" // Add padding for the eye button
                                />
                              </FormControl>
                              {/* Eye Toggle Button */}
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  // Eye open icon
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                ) : (
                                  // Eye closed icon
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  {Object.keys(signInForm.formState.errors).length > 0 && (
                    <div
                      dir="rtl"
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 "
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-red-800 dark:text-red-200 font-semibold text-sm mb-2">
                            يرجى تصحيح الأخطاء التالية:
                          </h4>
                          <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                            {Object.entries(signInForm.formState.errors).map(
                              ([key, error]) => (
                                <li
                                  key={key}
                                  className="flex items-center gap-2"
                                >
                                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                  {error.message}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {signInError && (
                    <div className="mb-3">
                      <div
                        dir="rtl"
                        className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300"
                      >
                        <p className="font-semibold text-sm">{signInError}</p>
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </>
          ) : (
            emailChecked !== "" &&
            !loading && (
              <p className="text-gray-400">فشل التحقق من البريد الإلكتروني.</p>
            )
          )}
        </Step>

        <Step>
          <h1>this for next button work</h1>
        </Step>
      </Stepper>
    </div>
  );
}

export default LoginForm;
