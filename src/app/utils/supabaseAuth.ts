import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "./supabaseSchema";

export const getServerComponentClient = () => {
  return createServerComponentClient<Database>({ cookies });
};
