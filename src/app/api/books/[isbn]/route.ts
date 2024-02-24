import {
  BooksUpdate,
  ResultGetBook,
  ResultSupabase,
  deleteBook,
  getBook,
  updateBook,
} from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * books GET 取得
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: { isbn: string } }
) => {
  console.log(`${req.url} GET called`);

  //リクエスト取得
  const isbn = params.isbn;
  if (!isbn) {
    console.log("ISBN が指定されていない");
    return new Response(null, { status: 400 });
  }

  //データ取得
  let result: ResultGetBook;
  try {
    result = await getBook(isbn);
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
 * books PUT 更新
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const PUT = async (
  req: NextRequest,
  { params }: { params: { isbn: string } }
) => {
  console.log(`${req.url} PUT called`);

  //リクエスト取得
  const isbn = params.isbn;
  if (!isbn) {
    console.log("ISBN が指定されていない");
    return new Response(null, { status: 400 });
  }

  let requestBody: BooksUpdate;
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
  let result: ResultGetBook;
  try {
    result = await updateBook(isbn, requestBody);
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
 * books DELETE 削除
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { isbn: string } }
) => {
  console.log(`${req.url} PUT called`);

  //リクエスト取得
  const isbn = params.isbn;
  if (!isbn) {
    console.log("ISBN が指定されていない");
    return new Response(null, { status: 400 });
  }

  //データ削除
  let result: ResultSupabase;
  try {
    result = await deleteBook(isbn);
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
