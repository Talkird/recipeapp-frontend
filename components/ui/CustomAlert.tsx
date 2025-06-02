import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

type CustomAlertProps = {
  title: string;
  description: string;
  triggerText?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  title,
  description,
  triggerText = "Open Alert",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Text>{triggerText}</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{cancelText}</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={onConfirm}>
            <Text>{confirmText}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
