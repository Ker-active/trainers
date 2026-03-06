import { TProfile } from "@/app/dashboard/profile/page";
import { cn } from "@/lib";
import { useFormContext } from "react-hook-form";

interface TagProps {
  value: string;
}

export const Tag = ({ value }: TagProps) => {
  const { watch, setValue } = useFormContext<TProfile>();

  const selectedServices = watch("services") || [];
  const isActive = selectedServices.includes(value);

  const toggleService = () => {
    let updated: string[];

    if (isActive) {
      updated = selectedServices.filter((service) => service !== value);
    } else {
      updated = [...selectedServices, value];
    }

    setValue("services", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <button
      type="button"
      onClick={toggleService}
      className={cn("text-sm border hover:bg-slate-100 rounded-full text-[#909090] py-[9px] px-[24.5px]", isActive && "bg-primary text-white hover:bg-primary/90")}
    >
      {value}
    </button>
  );
};
