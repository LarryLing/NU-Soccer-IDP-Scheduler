import { ForgotPasswordFormSchema } from "../../lib/schemas.ts";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth.ts";
import ErrorAlert from "@/components/authentication/error-alert.tsx";
import SuccessAlert from "@/components/authentication/success-alert.tsx";
import { useState } from "react";
import type { ForgotPasswordForm } from "@/lib/types.ts";

export default function ForgotPasswordCard() {
  const [success, setSuccess] = useState<string | null>();
  const [error, setError] = useState<string | null>();

  const { requestPasswordReset } = useAuth();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    try {
      const { email } = data;
      await requestPasswordReset(email);
      setSuccess("Please check your email for the password reset link.");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError("Failed to send a password reset link. Please try again.");
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address below to reset your password.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 mb-6">
            {error && <ErrorAlert message={error} />}
            {success && <SuccessAlert message={success} />}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-row-reverse gap-4">
            <Button type="submit" disabled={isSubmitting || isValidating}>
              Send Reset Link
            </Button>
            <Link to="/login">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting || isValidating}
              >
                Go Back
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
