import { useFormContext } from "react-hook-form";
import { Tag } from "./tag";
import { TProfile } from "@/app/dashboard/profile/page";
import { useState } from "react";
import { Input } from "../ui/input";

const AvailableAmenities = ["Changing area", "Bathroom", "Lockers", "Car park", "Towels", "mirrors"];

const AvailableSpecialNeeds = ["Wheelchair Accessibility", "Disability Friendly", "Pre-natal Friendly"];

export const Amenities = () => {
  const [specialNeeds, setSpecialNeeds] = useState(AvailableSpecialNeeds);
  const form = useFormContext<TProfile>();
  const [inputValue, setInputValue] = useState("");

  return (
    <article className="flex bg-white px-[20px] gap-[30px] py-[24px] rounded-[8px] flex-col ">
      <header>
        <h3 className="text-[#1C1939]  font-medium font-inter">Amenities</h3>
      </header>
      <hr />
    </article>
  );
};
