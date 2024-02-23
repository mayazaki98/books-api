import { BooksInsert, ResultSupabase, insertBook } from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * books POST 追加
 * @param req リクエスト
 * @returns
 */
export const POST = async (req: NextRequest) => {
  console.log(`${req.url} POST called`);

  const requestBody: BooksInsert = await req.json();
  const result: ResultSupabase = await insertBook(requestBody);

  switch (result) {
    case ResultSupabase.Error:
      console.log("データ追加中にエラー発生");
      return NextResponse.json(null, { status: 500 });
  }

  console.log("追加成功");
  return NextResponse.json(null, { status: 200 });
};
