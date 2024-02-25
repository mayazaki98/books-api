import {
  ResultSupabase,
  deleteUser,
  getUser,
  signOut,
} from "@/app/utils/supabase";
import { NextRequest } from "next/server";

/**
 * ユーザー削除
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req: NextRequest) => {
  console.log(`■${req.url} POST called`);

  //ユーザー削除
  let result: ResultSupabase;
  try {
    result = await deleteUser();
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  if (result !== ResultSupabase.Success) {
    console.log("ユーザー削除中にエラー発生");
    return new Response(null, { status: 500 });
  }

  console.log("削除成功");
  return new Response(null, { status: 204 });
};
