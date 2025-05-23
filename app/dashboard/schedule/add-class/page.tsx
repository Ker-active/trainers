/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormCheckBox, FormDate, FormInput, FormMedia, FormSelect } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetClassDetails, useGetUser } from "@/hooks/shared";
import { CacheKeys, cn, showError } from "@/lib";
import { client } from "@/lib/api";
import { AddClassSchema, TClassSchema } from "@/schemas/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PopoverArrow } from "@radix-ui/react-popover";
import { FormSchemaProvider } from "@/providers";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { data: userData } = useGetUser();
  const [classType, setClassType] = useState("CLASS");
  const form = useForm<TClassSchema>({
    resolver: zodResolver(AddClassSchema),
    mode: "onBlur",
    defaultValues: {
      classType: "CLASS",
      free: false,
      media: [],
    },
  });
  const classId = searchParams.get("classId");
  const { data: classDetails } = useGetClassDetails(classId);

  function onSubmit(values: TClassSchema) {
    if (form.getValues("media").length == 0) return toast.error("Picture is required");
    mutate(values);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TClassSchema) => {
      const formData = new FormData();
      formData.append("trainer", userData!?.data._id);
      Object.entries(data).forEach(([key, value]) => {
        if (key == "media" && value.every((item: any) => typeof item === "string")) return;
        if (key == "media") {
          value.forEach((item: any) => {
            formData.append("media", item);
          });
          return;
        }
        if (key == "price" && form.getValues("free") == true) return;
        formData.append(key, value as any);
      });
      return classId ? client.put(`/class/edit/${classId}`, formData) : client.post(`/class/create`, formData);
    },
    onError: (error) => {
      showError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.CLASSES],
      });
      toast.success("Saved successfully");
      router.back();
    },
  });

  console.log(userData?.data);

  useEffect(() => {
    if (classDetails && userData) {
      form.reset({
        ...classDetails.data,
        availableSlot: classDetails.data.availableSlot.toString(),
        price: classDetails.data?.price.toString(),
        room: classDetails.data?.room.toString(),
      });
    }
  }, [classDetails, userData]);

  console.log(form.formState.errors);
  console.log(form.watch());

  return (
    <section className="flex flex-col  font-inter gap-10">
      <header className={cn("flex gap-4 justify-between flex-col items-start sm:flex-row sm:items-center")}>
        <div className="flex flex-row items-center gap-2">
          <Button variant="ghost" className="border-[1.2px] rounded-[8px] border-[#BFBFBF]" onClick={() => router.back()} size="icon">
            <ArrowLeft color="#737373" />
          </Button>
          <h2 className="section-header">{classId ? "Edit Class" : "Add New Class"}</h2>
          <Popover>
            <PopoverTrigger>
              <ChevronDown />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <RadioGroup className="space-y-2" defaultValue={classType} onValueChange={setClassType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CLASS" id="r1" />
                  <Label htmlFor="r1">Class</Label>
                </div>
                <hr />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INDIVIDUAL TRAINING" id="r2" />
                  <Label htmlFor="r2">Individual Training</Label>
                </div>
              </RadioGroup>
            </PopoverContent>
          </Popover>
        </div>

        <Button form="form" type="submit" disabled={isPending} size="sm">
          {classId ? "Update Class" : "Add Class"}
        </Button>
      </header>
      <Form {...form}>
        <FormSchemaProvider schema={AddClassSchema._def.schema}>
          <form id="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col  bg-white  px-[27px] py-[40px] rounded-[8px] gap-6  ">
            <div className="grid grid-cols-1 place-items-start  gap-[28px] sm:grid-cols-2">
              <FormInput<TClassSchema> containerClassName="w-full" placeholder="Example: CrossFit" label="Title" name="title" />
              <FormSelect<TClassSchema> containerClassName="w-full" placeholder="Select" options={userData?.data.services || []} label="Type" name="type" />

              <FormInput<TClassSchema> containerClassName="w-full" placeholder="Enter" label="Available Slot" name="availableSlot" />
              <FormInput<TClassSchema> containerClassName="w-full" placeholder="Enter" label="Location" name="location" />
              <FormInput<TClassSchema> containerClassName="w-full" placeholder="Enter" label="Room" name="room" />
              <FormDate<TClassSchema> containerClassName="w-full" name="date" />

              <div className={cn("flex flex-row gap-4 items-start")}>
                <FormInput<TClassSchema> name="timeFrom" label="Time From (WAT)" type="time" />
                <p className={cn("mt-auto", form.formState.errors?.timeFrom || form.formState.errors.timeTo ? "mb-9" : "mb-3")}>to</p>
                <FormInput<TClassSchema> name="timeTo" type="time" label="Time To (WAT)" />
              </div>

              <div className="flex flex-row gap-6 items-center w-full justify-between">
                <FormInput<TClassSchema> disabled={form.watch("free")} type="number" containerClassName="w-full" placeholder="Enter" label="Price" name="price" />
                <FormCheckBox<TClassSchema>
                  containerClassName={cn("mt-auto mb-3", form?.formState?.errors?.price && "mb-9")}
                  checkBoxProps={{ className: "w-[25px] h-[25px]" }}
                  name="free"
                  checkBoxLabel="Free?"
                />
              </div>
              <FormInput<TClassSchema> placeholder="Enter" containerClassName="w-full" label="Online Link" name="onlineLink" />
            </div>
            <FormInput<TClassSchema>
              className="h-[200px] resize-none"
              maxLength={200}
              placeholder="Write something..."
              label="Description"
              isTextArea
              name="description"
              formDescription="Not more than 200 words"
            />
            <FormMedia label="Upload Picture of Class" />
          </form>
        </FormSchemaProvider>
      </Form>
    </section>
  );
}
