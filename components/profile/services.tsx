import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { TProfile } from "@/app/dashboard/profile/page";
import { ProfileHeader } from "./profile-header";
import { Button } from "../ui/button";
import { useGetServicesList } from "@/hooks/useProfileOptionsList";
import { Tag } from "./tag";

export const Services = () => {
  const { data, isLoading, isError } = useGetServicesList();
  const { watch, setValue } = useFormContext<TProfile>();

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const selectedServices = watch("services") || [];

  useEffect(() => {
    if (data?.data) {
      setAvailableServices(data.data.map((svc) => svc.ServiceName));
    }
  }, [data]);

  const addService = () => {
    const value = inputValue.trim();

    if (!value) return;

    if (selectedServices.includes(value)) {
      setInputValue("");
      return;
    }

    setValue("services", [...selectedServices, value], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setInputValue("");
  };

  if (isLoading) return <p>Loading services…</p>;
  if (isError) return <p>Couldn’t load services.</p>;

  return (
    <article className="flex bg-white px-[20px] gap-[30px] py-[24px] rounded-[8px] flex-col ">
      <ProfileHeader title="Services" />
      <hr />

      <ul className="flex flex-row flex-wrap gap-x-[15px] gap-y-[20px]">
        {availableServices.map((service) => (
          <li key={service}>
            <Tag value={service} />
          </li>
        ))}
      </ul>

      <div className="flex flex-col">
        <h3 className="text-[#1C1939] mb-4 font-inter">Not on the list? Simply type into the box below</h3>

        <div className="flex flex-row gap-2 items-center">
          <Input
            placeholder="Add new service"
            className="text-sm border h-[37px] w-[200px] rounded-full text-[#909090] py-[9px] px-[24.5px]"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addService();
              }
            }}
          />

          <Button type="button" size="sm" className="w-fit" onClick={addService}>
            Add
          </Button>
        </div>
      </div>

      {selectedServices.length > 0 && (
        <>
          <hr />
          <div className="flex flex-wrap gap-2">
            {selectedServices
              .filter((service) => !availableServices.includes(service))
              .map((service) => (
                <Tag key={service} value={service} />
              ))}
          </div>
        </>
      )}
    </article>
  );
};
