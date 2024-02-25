import { ResultGetUser, ResultSupabase, signUp } from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * サインアップ
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req: NextRequest) => {
  console.log(`■${req.url} POST called`);

  //リクエスト取得
  let requestBody: { email: string; password: string };
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

  //サインアップ
  let result: ResultGetUser;
  try {
    result = await signUp(requestBody.email, requestBody.password);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  if (result.result !== ResultSupabase.Success) {
    console.log("サインアップ中にエラー発生");
    return new Response(null, { status: 500 });
  }

  console.log("サインアップ成功");
  return NextResponse.json(result.data, { status: 201 });
};
