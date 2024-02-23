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

  const isbn = params.isbn;
  if (!isbn) {
    console.log("ISBN が指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const result: ResultGetBook = await getBook(isbn);

  switch (result.result) {
    case ResultSupabase.Error:
      console.log("データ取得中にエラー発生");
      return NextResponse.json(null, { status: 500 });

    case ResultSupabase.Nothing:
      console.log("該当データなし");
      return NextResponse.json(null, { status: 404 });
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

  const isbn = params.isbn;
  if (!isbn) {
    console.log("ISBN が指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const requestBody: BooksUpdate = await req.json();
  const result: ResultSupabase = await updateBook(isbn, requestBody);

  switch (result) {
    case ResultSupabase.Error:
      console.log("データ更新中にエラー発生");
      return NextResponse.json(null, { status: 500 });

    case ResultSupabase.Nothing:
      console.log("該当データなし");
      return NextResponse.json(null, { status: 404 });
  }

  console.log("更新成功");
  return NextResponse.json(null, { status: 200 });
};

/**
 * books DELETE 更新
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { isbn: string } }
) => {
  console.log(`${req.url} PUT called`);

  const isbn = params.isbn;
  if (!isbn) {
    console.log("ISBN が指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const result: ResultSupabase = await deleteBook(isbn);

  switch (result) {
    case ResultSupabase.Error:
      console.log("データ削除中にエラー発生");
      return NextResponse.json(null, { status: 500 });

    case ResultSupabase.Nothing:
      console.log("該当データなし");
      return NextResponse.json(null, { status: 404 });
  }

  console.log("削除成功");
  return NextResponse.json(null, { status: 200 });
};
