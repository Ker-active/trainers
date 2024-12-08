"use client";

import { FormInput } from "../forms";

const generalFields = [
  {
    name: "personalInformation.fullname",
    label: "Full Name",
    placeholder: "Enter full name",
  },
  {
    name: "personalInformation.phoneNumber",
    label: "Phone number",
    placeholder: "Enter phone number",
    type: "number",
  },
  {
    name: "personalInformation.location",
    label: "Location",
    placeholder: "Enter location",
  },
] as const;

interface IProps {
  fields: { name: string; label: string; placeholder: string; type?: string }[];
}

export const PersonalInformation = ({ fields }: IProps) => {
  const newFields = [...generalFields, ...fields];

  return (
    <article className="flex bg-white px-[20px] py-[15px] rounded-[8px] flex-col gap-4">
      <header>
        <h3 className="text-[#1C1939] font-medium font-inter">Personal Information</h3>
      </header>
      <hr />
      <div className="grid gap-x-4 gap-y-[18px] grid-cols-1 sm:grid-cols-2">
        {newFields.map((field) => {
          return <FormInput className="h-[50px]" {...field} key={field.name} />;
        })}
      </div>
    </article>
  );
};
