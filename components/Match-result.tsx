import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "@radix-ui/react-separator";
import { X } from "lucide-react";

const MatchResult = () => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <div className="flex justify-between items-center">
          <AlertDialogTitle className="text-gray-700">
            Upload your Resume
          </AlertDialogTitle>
          <AlertDialogCancel>
            <X size="12" />
          </AlertDialogCancel>
        </div>
        <AlertDialogDescription>
          Upload your cv to let AI predict how well of a match you are for this
          job.
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <AlertDialogFooter className="">
        <AlertDialogTrigger className="w-full">
          {" "}
          <Button className="w-full rounded-full">Upload</Button>
        </AlertDialogTrigger>
      </AlertDialogFooter>
      <Separator className="border-gray-300 border" />
      <AlertDialogFooter>
        <Button className="w-full bg-blue-200 text-blue-700 hover:bg-blue-300 rounded-full">
          Use your profile resume
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
};

export default MatchResult;
