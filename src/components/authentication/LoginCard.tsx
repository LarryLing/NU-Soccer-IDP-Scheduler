import { LoginFormSchema } from "../../lib/schemas.ts";
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

type FormSchema = z.infer<typeof LoginFormSchema>;

export default function LoginCard() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    console.log(data);
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password below to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-row-reverse gap-4">
        <Button type="submit" disabled={isSubmitting || isValidating}>
          Login
        </Button>
        <Link to="/signup">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting || isValidating}
          >
            Sign Up
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
