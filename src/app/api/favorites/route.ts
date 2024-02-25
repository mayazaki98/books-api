import {
  ResultGetBook,
  ResultGetFavorites,
  ResultSupabase,
  ResultUpdFavorites,
  deleteFavorites,
  existsFavorites,
  getFavorites,
  getUser,
  insertFavorites,
  updateFavorites,
} from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * favorites POST 追加
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
  if (!resUser.data || !resUser.data.userId) {
    console.log("ユーザーIDが取得できない");
    return new Response(null, { status: 500 });
  }

  //リクエスト取得
  let requestBody: { isbn: string };
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
  let resultGet: ResultSupabase;
  try {
    resultGet = await existsFavorites(resUser.data.userId, requestBody.isbn);
  } catch (e) {
    console.log("DBアクセス中に例外発生");
    console.error(e);
    return new Response(null, { status: 500 });
  }

  switch (resultGet) {
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
  let result: ResultUpdFavorites;
  try {
    result = await insertFavorites(resUser.data.userId, requestBody.isbn);
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

/**
 * favorites GET 取得
 * @param req リクエスト
 * @returns
 */
export const GET = async (req: NextRequest) => {
  console.log(`■${req.url} GET called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }
  if (!resUser.data || !resUser.data.userId) {
    console.log("ユーザーIDが取得できない");
    return new Response(null, { status: 500 });
  }

  //データ取得
  let result: ResultGetFavorites;
  try {
    result = await getFavorites(resUser.data.userId);
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
 * favorites PUT 更新
 * @param req リクエスト
 * @returns
 */
export const PUT = async (req: NextRequest) => {
  console.log(`■${req.url} PUT called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }
  if (!resUser.data || !resUser.data.userId) {
    console.log("ユーザーIDが取得できない");
    return new Response(null, { status: 500 });
  }

  let requestBody: { isbnFrom: string; isbnTo: string };
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
  let result: ResultUpdFavorites;
  try {
    result = await updateFavorites(
      resUser.data.userId,
      requestBody.isbnFrom,
      requestBody.isbnTo
    );
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
 * favorites DELETE 削除
 * @param req リクエスト
 * @returns
 */
export const DELETE = async (req: NextRequest) => {
  console.log(`■${req.url} DELETE called`);

  const resUser = await getUser();
  if (resUser.result !== ResultSupabase.Success) {
    console.log("サインインしていない");
    return new Response(null, { status: 401 });
  }
  if (!resUser.data || !resUser.data.userId) {
    console.log("ユーザーIDが取得できない");
    return new Response(null, { status: 500 });
  }

  //リクエスト取得
  let requestBody: { isbn: string };
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

  //データ削除
  let result: ResultSupabase;
  try {
    result = await deleteFavorites(resUser.data.userId, requestBody.isbn);
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
