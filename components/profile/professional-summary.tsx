"use client";

import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { TProfile } from "@/app/dashboard/profile/page";
import { ProfileHeader } from "./profile-header";

export const ProfessionalSummary = () => {
  const formSchema = useFormContext<TProfile>();
  return (
    <article className="flex bg-white px-[20px] py-[15px] rounded-[8px] flex-col gap-4">
      <ProfileHeader title="Professional Summary" />
      <FormField
        control={formSchema.control}
        name={"personalInformation.professionalSummary"}
        render={({ field: formField }) => (
          <FormItem>
            <FormControl>
              <Textarea className="resize-none h-[160px] w-full" placeholder={"Write Something..."} {...formField} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </article>
  );
};
