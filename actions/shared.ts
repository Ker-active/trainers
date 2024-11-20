"use server";

import { createAxiosClient } from "@/lib/api";
import { cookies } from "next/headers";

const cookie = cookies();

export const server = createAxiosClient({
  Authorization: `Bearer ${cookie.get("kerTrainers")}`,
});

export const setCookie = (value: string) => {
  cookies().set("kerTrainers", value, {
    maxAge: 60 * 60 * 24 * 1,
    sameSite: "strict",
    path: "/",
    secure: true,
  });
};

export const clearCookie = () => {
  cookies().delete("kerTrainers");
};
