import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

type ErrorAlertProps = {
  message: string;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircleIcon />
      <AlertTitle>Something went wrong...</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  );
}
