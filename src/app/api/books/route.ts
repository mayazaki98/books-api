import {
  BooksInsert,
  ResultGetBook,
  ResultSupabase,
  getBook,
  getUser,
  insertBook,
} from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * books POST 追加
 * @param req リクエスト
 * @returns
 */
export const POST = async (req: NextRequest) => {
  console.log(`■${req.url} POST called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }

  //リクエスト取得
  let requestBody: BooksInsert;
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

  //既にデータが存在しているかを確認
  let resultGet: ResultGetBook;
  try {
    resultGet = await getBook(requestBody.isbn);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  switch (resultGet.result) {
    case ResultSupabase.Error:
      console.log("データ取得中にエラー発生");
      return new Response(null, { status: 500 });

    case ResultSupabase.Success:
      console.log(`既にデータが存在する isbn=${requestBody.isbn}`);
      return new Response(null, { status: 409 });

    case ResultSupabase.Nothing:
      //データが存在しないので作成可能
      break;
  }

  //データ作成
  let result: ResultGetBook;
  try {
    result = await insertBook(requestBody);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  if (result.result !== ResultSupabase.Success) {
    console.log("データ追加中にエラー発生");
    return new Response(null, { status: 500 });
  }

  console.log("追加成功");
  return NextResponse.json(result.data, { status: 201 });
};
