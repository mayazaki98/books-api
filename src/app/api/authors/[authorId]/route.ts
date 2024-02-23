import {
  AuthorsUpdate,
  ResultGetAuthor,
  ResultSupabase,
  deleteAuthor,
  getAuthor,
  updateAuthor,
} from "@/utils/supabase";
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
  console.log(`${req.url} GET called`);

  const authorId = params.authorId;
  if (!authorId) {
    console.log("著者IDが指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const result: ResultGetAuthor = await getAuthor(authorId);

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
 * authors PUT 更新
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const PUT = async (
  req: NextRequest,
  { params }: { params: { authorId: number } }
) => {
  console.log(`${req.url} PUT called`);

  const authorId = params.authorId;
  if (!authorId) {
    console.log("著者IDが指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const requestBody: AuthorsUpdate = await req.json();
  const result: ResultSupabase = await updateAuthor(authorId, requestBody);

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
 * authors DELETE 更新
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { authorId: number } }
) => {
  console.log(`${req.url} PUT called`);

  const authorId = params.authorId;
  if (!authorId) {
    console.log("authorId が指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const result: ResultSupabase = await deleteAuthor(authorId);

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
