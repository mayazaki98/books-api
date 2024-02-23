import {
  PublishersUpdate,
  ResultGetPublisher,
  ResultSupabase,
  deletePublisher,
  getPublisher,
  updatePublisher,
} from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * publishers GET 取得
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: { publisherId: number } }
) => {
  console.log(`${req.url} GET called`);

  const publisherId = params.publisherId;
  if (!publisherId) {
    console.log("出版社IDが指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const result: ResultGetPublisher = await getPublisher(publisherId);

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
 * publishers PUT 更新
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const PUT = async (
  req: NextRequest,
  { params }: { params: { publisherId: number } }
) => {
  console.log(`${req.url} PUT called`);

  const publisherId = params.publisherId;
  if (!publisherId) {
    console.log("出版社IDが指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const requestBody: PublishersUpdate = await req.json();
  const result: ResultSupabase = await updatePublisher(
    publisherId,
    requestBody
  );

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
 * publishers DELETE 更新
 * @param req リクエスト
 * @param param1
 * @returns
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { publisherId: number } }
) => {
  console.log(`${req.url} PUT called`);

  const publisherId = params.publisherId;
  if (!publisherId) {
    console.log("publisherId が指定されていない");
    return NextResponse.json(null, { status: 400 });
  }

  const result: ResultSupabase = await deletePublisher(publisherId);

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
