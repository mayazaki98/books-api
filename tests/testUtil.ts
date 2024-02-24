import { Database } from "@/app/utils/supabaseSchema";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const initializeTestData = async () => {
  console.log("テストデータ作成");

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
