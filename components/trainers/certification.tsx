import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { TProfile } from "@/app/dashboard/profile/page";
import { useEffect, useState } from "react";

export const Certification = () => {
  const { setValue, watch } = useFormContext<TProfile>();

  const certification = watch("certification");

  const [preview, setPreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setValue("certification", file, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }

  useEffect(() => {
    if (typeof certification === "string") {
      setPreview(certification);
    }
  }, [certification]);

  useEffect(() => {
    return () => {
      if (preview && typeof certification !== "string") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, certification]);

  return (
    <article className="flex h-full bg-white px-[20px] py-[15px] rounded-[8px] flex-col gap-4">
      <header>
        <h3 className="text-[#1C1939] font-medium font-inter">Certification</h3>
      </header>

      <hr />

      <div className="flex items-center py-4 justify-center flex-col h-full gap-4">
        <Image width={80} height={80} alt="Certificate Icon" src="/certificate.svg" />

        <div className="w-full flex text-[13px] flex-col items-center gap-2">
          {preview ? (
            typeof certification === "string" ? (
              <a href={preview} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                View Certification
              </a>
            ) : (
              <p className="text-[#5B5971]">{certification?.name}</p>
            )
          ) : (
            <p className="text-[#5B5971] text-center">You do not have any certification yet.</p>
          )}

          <button type="button" onClick={() => document.getElementById("certification")?.click()} className="text-primary underline">
            {certification ? "Reupload" : "Upload"} Certificate
          </button>
        </div>
      </div>

      <input hidden accept="image/*,.pdf" type="file" id="certification" onChange={handleImageChange} />
    </article>
  );
};
