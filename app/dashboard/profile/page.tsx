"use client";

import { Media, PersonalInformation, ProfessionalSummary, Services } from "@/components/profile";
import { Certification, Photo } from "@/components/trainers";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetUser } from "@/hooks/shared";
import { CacheKeys, cn, showError } from "@/lib";
import { client } from "@/lib/api";
import { FormSchemaProvider } from "@/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Routes } from "@/lib";
import { useRouter } from "nextjs-toploader/app";
import { z } from "zod";

const schema = z.object({
  personalInformation: z.object({
    fullname: z.string().min(1, { message: "Gym Name is required." }),
    phoneNumber: z.string().min(1, { message: "Phone number is required." }),
    location: z.string().optional(),
    professionalSummary: z.string().min(1, { message: "Summary is required." }),
  }),
  socialMedia: z.object({
    instagram: z.string().min(1, { message: "Instagram is required." }),
    twitter: z.string().optional(),
    website: z.string().optional(),
  }),
  certification: z.any(),
  profilePhoto: z.any(),
  services: z.array(z.string().min(1, { message: "Service is required." })),
  media: z.array(z.any()),
});

export type TProfile = z.infer<typeof schema>;

const calculatePercentage = (data: TProfile) => {
  let percentage = 0;

  const { personalInformation, socialMedia, services, certification, profilePhoto, media } = data;

  const personalInfoComplete = personalInformation?.fullname && personalInformation?.phoneNumber && socialMedia?.instagram && personalInformation?.professionalSummary;
  // if (profilePhoto) percentage += 20;

  // if (personalInfoComplete) percentage += 25;
  // if (certification) percentage += 25;
  // if (services.length >= 1) percentage += 25;
  // if (media.length >= 1) percentage += 25;

  if (personalInfoComplete) percentage += 33.33;
  if (services.length >= 1) percentage += 33.33;
  if (media.length >= 1) percentage += 33.34; // To total 100%

  return Math.round(percentage);

  return percentage;
};

export default function Page() {
  const router = useRouter();
  const { data: userData } = useGetUser();
  const queryClient = useQueryClient();
  const form = useForm<TProfile>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      services: [],
      media: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TProfile) => {
      const formData = new FormData();
      Object.entries(data.personalInformation).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("socialMedia", JSON.stringify(data.socialMedia));

      if (!!data?.certification && typeof data.certification !== "string") formData.append("certification", data.certification);
      if (data.profilePhoto) formData.append("profilePhoto", data.profilePhoto);

      // if (!!data.profilePhoto && typeof data.profilePhoto !== "string") formData.append("profilePhoto", data.profilePhoto);

      data.services.forEach((service) => {
        formData.append("services", service);
      });

      data.media.forEach((media) => {
        if (typeof media === "string") return; //for editing, do not append if it is a string
        formData.append("media", media);
      });

      console.log({ formData });

      return client.put(`/user/update/${userData?.data._id}`, formData);
    },
    onError: (error) => {
      showError(error);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.USER],
      });
      toast.success("Profile updated successfully");
      router.replace(Routes.home);
    },
  });

  function onSubmit(value: TProfile) {
    console.log({ value });

    if (form.getValues("media").length === 0) return toast.error("Media is required");
    mutate(value);
  }

  useEffect(() => {
    if (userData) {
      form.reset({
        personalInformation: userData.data,
        certification: userData.data?.certification || "",
        profilePhoto: userData.data?.profilePhoto || "",
        socialMedia: userData.data?.socialMedia || {},
        services: userData?.data.services || [],
        media: userData?.data.media || [],
      });
    }
  }, [userData]);

  const percentage = calculatePercentage(form.watch());

  return (
    <section className="flex flex-col gap-[30px]">
      <header className={cn("flex flex-row bg-[#FFFAF1] border py-[9px] px-4 rounded-[8px]  border-[#FFB020] items-center justify-between", percentage == 100 && "border-primary")}>
        <div className="flex flex-row gap-2 items-center">
          <Info color={percentage == 100 ? "#008080" : "#996A13"} size={16} />
          <p className={cn("text-[#996A13] font-sm font-semibold", percentage == 100 && "text-primary")}>{percentage == 100 ? "Profile Completed" : "Complete your profile to continue"}</p>
        </div>
        <Button disabled={isPending} type="submit" form="form" size="sm" className={cn("bg-[#D59C34] w-fit", percentage == 100 && "bg-primary")}>
          {percentage == 100 ? "Save" : `${percentage}%`}
        </Button>
      </header>
      <Form {...form}>
        <FormSchemaProvider schema={schema}>
          <form className="flex flex-col gap-[30px]" id="form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col items-stretch gap-[30px] sm:gap-[51px] sm:flex-row">
              <div className="flex-col w-full flex gap-[30px]">
                <PersonalInformation
                  fields={[
                    {
                      name: "socialMedia.instagram",
                      label: "Instagram",
                      placeholder: "Full Instagram URL",
                    },
                    {
                      name: "socialMedia.twitter",
                      label: "X (twitter)",
                      placeholder: "Full X URL",
                    },
                    {
                      name: "socialMedia.website",
                      label: "Website",
                      placeholder: "https://url.com",
                    },
                  ]}
                />
                <ProfessionalSummary />
              </div>
              <div className="sm:max-w-[262px] gap-[30px] flex flex-col sm:min-h-full  w-full">
                <Photo />
                <Certification />
              </div>
            </div>

            <Services />
            <Media />
          </form>
        </FormSchemaProvider>
      </Form>
    </section>
  );
}
