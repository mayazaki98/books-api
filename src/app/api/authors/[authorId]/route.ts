import {
  AuthorsUpdate,
  ResultGetAuthor,
  ResultSupabase,
  deleteAuthor,
  getAuthor,
  getUser,
  updateAuthor,
} from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * authors GET 取得
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: { authorId: number } }
) => {
  console.log(`■${req.url} GET called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }

  //リクエスト取得
  const authorId = params.authorId;
  if (!authorId) {
    console.log("著者IDが指定されていない");
    return new Response(null, { status: 400 });
  }

  //データ取得
  let result: ResultGetAuthor;
  try {
    result = await getAuthor(authorId);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  switch (result.result) {
    case ResultSupabase.Error:
      console.log("データ取得中にエラー発生");
      return new Response(null, { status: 500 });

    case ResultSupabase.Nothing:
      console.log("該当データなし");
      return new Response(null, { status: 404 });
  }

  console.log("取得成功");
  return NextResponse.json(result.data, { status: 200 });
};

/**
 * authors PUT 更新
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const PUT = async (
  req: NextRequest,
  { params }: { params: { authorId: number } }
) => {
  console.log(`■${req.url} PUT called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }

  //リクエスト取得
  const authorId = params.authorId;
  if (!authorId) {
    console.log("著者IDが指定されていない");
    return new Response(null, { status: 400 });
  }

  let requestBody: AuthorsUpdate;
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

  //データ更新
  let result: ResultGetAuthor;
  try {
    result = await updateAuthor(authorId, requestBody);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  switch (result.result) {
    case ResultSupabase.Error:
      console.log("データ更新中にエラー発生");
      return new Response(null, { status: 500 });

    case ResultSupabase.Nothing:
      console.log("該当データなし");
      return new Response(null, { status: 404 });
  }

  console.log("更新成功");
  return NextResponse.json(result.data, { status: 200 });
};

/**
 * authors DELETE 削除
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { authorId: number } }
) => {
  console.log(`■${req.url} DELETE called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }

  //リクエスト取得
  const authorId = params.authorId;
  if (!authorId) {
    console.log("authorId が指定されていない");
    return new Response(null, { status: 400 });
  }

  //データ削除
  let result: ResultSupabase;
  try {
    result = await deleteAuthor(authorId);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  switch (result) {
    case ResultSupabase.Error:
      console.log("データ削除中にエラー発生");
      return new Response(null, { status: 500 });

    case ResultSupabase.Nothing:
      console.log("該当データなし");
      return new Response(null, { status: 404 });
  }

  console.log("削除成功");
  return new Response(null, { status: 204 });
};
