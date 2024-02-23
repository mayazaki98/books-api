import {
  AuthorsInsert,
  ResultSupabase,
  insertAuthor,
} from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * authors POST 追加
 * @param req リクエスト
 * @returns
 */
export const POST = async (req: NextRequest) => {
  console.log(`${req.url} POST called`);

  const requestBody: AuthorsInsert = await req.json();
  const result: ResultSupabase = await insertAuthor(requestBody);

  switch (result) {
    case ResultSupabase.Error:
      console.log("データ追加中にエラー発生");
      return NextResponse.json(null, { status: 500 });
  }

  console.log("追加成功");
  return NextResponse.json(null, { status: 200 });
};
