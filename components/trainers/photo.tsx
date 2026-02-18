"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useFormContext } from "react-hook-form";
import { useEffect, useMemo } from "react";

export const Photo = () => {
  const form = useFormContext();
  const profilePhoto = form.watch("profilePhoto");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    form.setValue("profilePhoto", e.target.files[0], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  const previewUrl = useMemo(() => {
    if (!profilePhoto) return "/user.svg";

    if (typeof profilePhoto === "string") {
      return profilePhoto;
    }

    return URL.createObjectURL(profilePhoto);
  }, [profilePhoto]);

  useEffect(() => {
    return () => {
      if (profilePhoto && typeof profilePhoto !== "string") {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, profilePhoto]);

  return (
    <div className="flex bg-white w-full items-center py-[28px] flex-col gap-2">
      <div className="relative w-[150px] overflow-hidden rounded-full h-[150px]">
        <Image
          className="object-cover object-top"
          alt="Avatar"
          src={previewUrl}
          fill
        />
      </div>

      <Button
        onClick={() => document.getElementById("avatar-input")?.click()}
        type="button"
        variant="outline"
        size="sm"
        className="rounded-md font-medium"
      >
        Upload Profile Picture
      </Button>

      <input
        onChange={handleImageChange}
        hidden
        accept="image/*"
        type="file"
        id="avatar-input"
      />
    </div>
  );
};
