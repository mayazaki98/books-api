import {
  ResultGetUser,
  ResultSupabase,
  getUser,
  signIn,
  updatePassword,
} from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * パスワード更新
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req: NextRequest) => {
  console.log(`■${req.url} POST called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }

  //リクエスト取得
  let requestBody: { password: string };
  try {
    requestBody = await req.json();
    if (!requestBody) {
      console.log("リクエストJSONがnull");
      return new Response(null, { status: 400 });
    }
  } catch (e) {
    console.log("リクエストJSON取得で例外発生");
    console.error(e);
    return new Response(null, { status: 400 });
  }

  //パスワード更新
  let result: ResultGetUser;
  try {
    result = await updatePassword(requestBody.password);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  if (result.result !== ResultSupabase.Success) {
    console.log("パスワード更新中にエラー発生");
    return new Response(null, { status: 500 });
  }

  console.log("パスワード更新成功");
  return NextResponse.json(result.data, { status: 200 });
};
