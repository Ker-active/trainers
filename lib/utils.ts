import { Routes } from "./routes";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { InputProps } from "@/components/ui/input";
import { format, isToday, isYesterday, parseISO, isSameDay } from "date-fns";
import { IClassResponse } from "./types";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convert24to12 = (time24: string) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes}${ampm}`;
};

export const isFieldRequired = <T extends z.ZodType>(schema: any, path: string): boolean => {
  try {
    schema.partial({ [path]: true }).parse({ [path]: undefined });
    return false;
  } catch (error) {
    return true;
  }
};

export const isRequiredFn = (schema: any, name: string) => {
  if (!schema) return false;

  const pathParts = name.split(".");

  let currentField: any = schema.shape; // Start with the top-level schema shape
  for (const part of pathParts) {
    currentField = currentField?.[part]?.shape || currentField?.[part];
    if (!currentField) return false; // Field doesn't exist
  }

  // Check if the field is optional
  const isOptional = currentField.isOptional?.() || currentField.safeParse(undefined).success || currentField.isNullable?.();

  return !isOptional;
};

export enum CacheKeys {
  USER = "user",
  CLASSES = "classes",
  Events = "events",
  Price = "price",
  Trainers = "trainers",
  Services_List = "services list",
  Amenities_List = "amenities list",
  SpecialNeeds_List = "Special Needs list",
}

export const showError = (error: any) => {
  return toast.error(error.response.data.message);
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

export const publicRoutes: string[] = [];
export const authRoutes: string[] = [Routes.login, Routes.register, Routes.forgotPassword, Routes.resetPassword];

interface FormFieldTypeObject<T> extends Omit<Partial<InputProps>, "name"> {
  label: string;
  name: keyof T;
}

export type FormFieldType<T> = FormFieldTypeObject<T>[];

interface Message {
  id: number;
  message: string;
  senderId: string;
}

export const isSameUser = (messages: Message[], currentMessage: Message, index: number) => {
  const previousMessage = messages[index - 1];
  if (!previousMessage) {
    return false;
  }
  return previousMessage.senderId === currentMessage.senderId;
};

export function formatDate(date: Date) {
  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMMM d, yyyy");
  }
}

export const calculateTime = (inputDateStr: string) => {
  // Assuming the input date string is in UTC format
  const inputDate = new Date(inputDateStr);

  const currentDate = new Date();

  // Set up date formats
  const timeFormat = { hour: "numeric", minute: "numeric" } as any;
  const dateFormat = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  } as any;

  if (inputDate.getUTCDate() === currentDate.getUTCDate() && inputDate.getUTCMonth() === currentDate.getUTCMonth() && inputDate.getUTCFullYear() === currentDate.getUTCFullYear()) {
    const ampmTime = inputDate.toLocaleTimeString("en-US", timeFormat);
    return ampmTime;
  } else if (inputDate.getUTCDate() === currentDate.getUTCDate() - 1 && inputDate.getUTCMonth() === currentDate.getUTCMonth() && inputDate.getUTCFullYear() === currentDate.getUTCFullYear()) {
    // Tomorrow: Show "Yesterday"

    return "Yesterday";
  } else if (Math.floor((+currentDate - +inputDate) / (1000 * 60 * 60 * 24)) > 1 && Math.floor((+currentDate - +inputDate) / (1000 * 60 * 60 * 24)) <= 7) {
    const timeDifference = Math.floor((+currentDate - +inputDate) / (1000 * 60 * 60 * 24));

    const targetDate = new Date();
    targetDate.setDate(currentDate.getDate() - timeDifference);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDay = daysOfWeek[targetDate.getDay()];

    return targetDay;
  } else {
    // More than 7 days ago: Show date in DD/MM/YYYY format
    const formattedDate = inputDate.toLocaleDateString("en-GB", dateFormat);
    return formattedDate;
  }
};

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface ClassDetails {
  name: string;
  trainer: string;
  time: string;
  onLinkLink: string;
  _id: string;
}

interface DayGroup {
  day: string;
  classes: ClassDetails[];
}

export const getClassesForDate = (data: IClassResponse["data"], targetDate: Date) => {
  if (!data) return [];

  const filteredData = data.filter((item) => isSameDay(parseISO(item.date), targetDate));

  // Group filtered data by day of the week
  const groupedData = filteredData.reduce<DayGroup[]>((acc, item) => {
    const day = format(parseISO(item.date), "EEEE");

    const classDetails = {
      name: item.title,
      onLinkLink: item.onlineLink,
      _id: item._id,
      trainer: item.trainer.fullname,
      time: `${item.timeFrom} - ${item.timeTo}`,
    };

    const existingDay = acc.find((d) => d.day === day);
    if (existingDay) {
      existingDay.classes.push(classDetails);
    } else {
      acc.push({
        day,
        classes: [classDetails],
      });
    }

    return acc;
  }, []);

  const timeTable = weekDays.map((day) => {
    const foundDay = groupedData.find((d) => d.day === day);
    return foundDay || { day, classes: [] };
  });

  return timeTable;
};

export const getClassesForDateArray = (data: IClassResponse["data"], targetDate: Date): ClassDetails[] => {
  if (!data) return [];

  return data
    .filter((item) => isSameDay(parseISO(item.date), targetDate))
    .map((item) => ({
      name: item.title,
      onLinkLink: item.onlineLink,
      _id: item._id,
      trainer: item.trainer.fullname,
      time: `${item.timeFrom} - ${item.timeTo}`,
    }));
};
