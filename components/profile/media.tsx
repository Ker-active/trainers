import { TProfile } from "@/app/dashboard/profile/page";
import { X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { ProfileHeader } from "./profile-header";

export const Media = () => {
  const { watch, setValue, getValues } = useFormContext<TProfile>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const medias = watch("media") || [];

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length < 1) return;

    const currentItems = getValues("media") || [];
    const newFiles = Array.from(files);

    const combined = [...currentItems, ...newFiles];

    if (combined.length > 5) {
      toast.error("Max 5 files allowed");
      setValue("media", combined.slice(0, 5), { shouldDirty: true });
    } else {
      setValue("media", combined, { shouldDirty: true });
    }
  }

  const handleRemove = (index: number) => {
    const current = getValues("media") || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("media", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <article className="flex bg-white px-[20px] py-[15px] rounded-[8px] flex-col gap-4">
      <ProfileHeader title="Media" />
      <hr />

      {medias.length === 0 ? (
        <div className="grid text-[13px] py-[100px] place-items-center">
          <Image alt="Media Icon" src={"/gallery.svg"} width={80} height={80} />
          <p>You do not have any pictures or videos yet.</p>
          <input multiple accept="image/*" onChange={handleChange} ref={fileInputRef} type="file" className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary underline mt-2">
            Upload media
          </button>
        </div>
      ) : (
        <div className="grid p-1 relative pb-12 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {medias.map((media, index) => {
            const src = typeof media === "string" ? media : URL.createObjectURL(media);
            return (
              <div key={index} className="relative border h-[200px] w-full rounded-[5px] overflow-hidden">
                <button type="button" onClick={() => handleRemove(index)} className="absolute top-2 right-2 rounded-full bg-white p-2 z-10 shadow-sm">
                  <X size={16} />
                </button>
                <Image fill className="object-contain" src={src} alt={`media-${index}`} />
              </div>
            );
          })}

          {medias.length < 5 && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary absolute left-[50%] translate-x-[-50%] bottom-1 underline">
              Upload more media
            </button>
          )}

          <input multiple accept="image/*" onChange={handleChange} ref={fileInputRef} type="file" className="hidden" />
        </div>
      )}
    </article>
  );
};
