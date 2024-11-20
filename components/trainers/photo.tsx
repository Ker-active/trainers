"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useFormContext } from "react-hook-form";

export const Photo = () => {
  const form = useFormContext();
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      form.setValue("profilePhoto", e.target.files[0]);
    }
  }

  const profilePhoto = form.watch("profilePhoto");

  return (
    <div className="flex bg-white w-full items-center py-[28px] flex-col gap-2">
      <div className="relative w-[150px] overflow-hidden  rounded-full h-[150px]">
        <Image className="object-cover object-top" alt="Avatar" src={profilePhoto ? (typeof profilePhoto === "string" ? profilePhoto : URL.createObjectURL(profilePhoto)) : "/user.svg"} fill />
      </div>
      <div className="flex gap-2 flex-row items-center">
        <Button onClick={() => document.getElementById("avatar-input")?.click()} type="button" variant="outline" size="sm" className="space-x-1 rounded-md font-medium">
          <span>Upload Profile Picture</span>
        </Button>
      </div>
      <input onChange={handleImageChange} hidden accept="image/*" type="file" id="avatar-input" />
    </div>
  );
};
