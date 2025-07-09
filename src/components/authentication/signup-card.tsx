import { SignupFormSchema } from "../../lib/schemas.ts";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
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
import { useState } from "react";
import ErrorAlert from "@/components/authentication/error-alert.tsx";
import SuccessAlert from "@/components/authentication/success-alert.tsx";

type FormSchema = z.infer<typeof SignupFormSchema>;

export default function SignUpCard() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signup } = useAuth();

  const form = useForm<FormSchema>({
    resolver: zodResolver(SignupFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      const { email, password } = data;
      await signup(email, password);
      setSuccess("Account created successfully. Please verify your email.");
      setError(null);
    } catch {
      setError("Failed to create account. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Enter your email and password below to create an account.
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
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-row-reverse gap-4">
            <Button type="submit" disabled={isSubmitting || isValidating}>
              Sign Up
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
