import { Database } from "@/app/utils/supabaseSchema";
import { createClient } from "@supabase/supabase-js";
import { instance, mock, reset, when } from "ts-mockito";
import { POST as signinPOST } from "@/app/api/auth/signin/route";
import { POST as signoutPOST } from "@/app/api/auth/signout/route";
import { NextRequest } from "next/server";
import { promises } from "readline";
import { cookies } from "next/headers";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const testUtilSignIn = async (mockedRequest: NextRequest) => {
  console.log("サインイン");

  when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/signin");
  when(mockedRequest.json).thenReturn(async () => {
    return {
      email: "test01@booksapi.test.com",
      password: "jrw0RPR*hbt-zex5kqx",
    };
  });
  await signinPOST(instance(mockedRequest));
};

export const testUtilsSignOut = async (mockedRequest: NextRequest) => {
  console.log("サインアウト");

  when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/signout");
  await signoutPOST(instance(mockedRequest));
};

export const testUtilsCreateTestData = async () => {
  console.log("テストデータ作成");

  //authors 追加
  {
    const { error } = await supabase.from("authors").insert([
      {
        authorId: 800,
        name: "テスト著者800",
      },
      {
        authorId: 801,
        name: "テスト著者801",
      },
    ]);
  }

  //publishers 追加
  {
    const { error } = await supabase.from("publishers").insert([
      {
        publisherId: 900,
        name: "テスト出版社900",
      },
      {
        publisherId: 901,
        name: "テスト出版社901",
      },
    ]);
  }

  //books 追加
  {
    const { error } = await supabase.from("books").insert([
      {
        isbn: "Z00",
        name: "書籍Z00",
        authorId: 801,
        publisherId: 900,
        publishedAt: "2022-09-03T17:06:30.21",
      },
      {
        isbn: "Z01",
        name: "書籍Z01",
        authorId: 801,
        publisherId: 900,
        publishedAt: "2022-09-04T16:07:48.53",
      },
    ]);
  }
};

export const testUtilsDeleteTestData = async () => {
  console.log("テストデータ削除");

  //authors 削除
  {
    const { error } = await supabase
      .from("authors")
      .delete()
      .in("authorId", [800, 801, 802]);
  }

  //publishers 削除
  {
    const { error } = await supabase
      .from("publishers")
      .delete()
      .in("publisherId", [900, 901, 902]);
  }

  //books 削除
  {
    const { error } = await supabase
      .from("books")
      .delete()
      .in("isbn", ["Z00", "Z01", "Z02"]);
  }
};

export const testUtilsSendRequest = async (
  url: string,
  method: string,
  body: any
): Promise<{ response: Response; json: any }> => {
  let response: Response;

  if (method === "GET") {
    response = await fetch(url, {
      credentials: "include",
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    response = await fetch(url, {
      credentials: "include",
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  const text = await response.text();
  let json: any;
  if (text) {
    json = JSON.parse(await text);
  }
  return { response, json };
};
