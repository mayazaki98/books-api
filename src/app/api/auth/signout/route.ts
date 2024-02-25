import { ResultSupabase, signOut } from "@/app/utils/supabase";
import { NextRequest } from "next/server";

/**
 * サインアウト
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req: NextRequest) => {
  console.log(`${req.url} POST called`);

  //サインアウト
  let result: ResultSupabase;
  try {
    result = await signOut();
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  if (result !== ResultSupabase.Success) {
    console.log("サインアウト中にエラー発生");
    return new Response(null, { status: 500 });
  }

  console.log("サインアウト成功");
  return new Response(null, { status: 200 });
};
