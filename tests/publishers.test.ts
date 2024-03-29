import { NextRequest } from "next/server";
import { POST } from "@/app/api/publishers/route";
import { DELETE, GET, PUT } from "@/app/api/publishers/[publisherId]/route";
import { GET as booksGET } from "@/app/api/books/[isbn]/route";
import { instance, mock, reset, when } from "ts-mockito";
import {
  testUtilsSignOut,
  testUtilsDeleteTestData,
  testUtilSignIn,
  testUtilsCreateTestData,
} from "./testUtil";

jest.mock("../src/app/utils/supabaseAuth");
import * as supabaseAuth from "../src/app/utils/supabaseAuth";
import { supabase } from "@/app/utils/supabase";

describe("tests publishers", () => {
  const mockedRequest: NextRequest = mock(NextRequest);

  beforeAll(async () => {
    //getServerComponentClient は cookie を利用するクライアントを返すが、
    //jest では cookie を利用できないので、cookie を利用しないクライアント
    //を返すようにモックする。
    const walkSpy = jest
      .spyOn(supabaseAuth, "getServerComponentClient")
      .mockReturnValue(supabase);

    await testUtilSignIn(mockedRequest);
    await testUtilsCreateTestData();
  }, 10000);

  afterEach(async () => {
    reset(mockedRequest);
  });

  afterAll(async () => {
    await testUtilsDeleteTestData();
    await testUtilsSignOut(mockedRequest);
  }, 10000);

  test("GET データなし(publisherId:902, データ作成前)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    const response = await GET(instance(mockedRequest), {
      params: { publisherId: 902 },
    });
    expect(response.status).toBe(404);
  });

  test("POST データ作成(publisherId:902)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    when(mockedRequest.json).thenReturn(async () => {
      return { publisherId: 902, name: "テスト出版社902" };
    });
    const response = await POST(instance(mockedRequest));
    expect(response.status).toBe(201);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      publisherId: 902,
      name: "テスト出版社902",
      books: [],
      relatedAuthors: [],
    });
  });

  test("GET データあり(publisherId:902, データ作成後)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    const response = await GET(instance(mockedRequest), {
      params: { publisherId: 902 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      publisherId: 902,
      name: "テスト出版社902",
      books: [],
      relatedAuthors: [],
    });
  });

  test("PUT データ更新(publisherId:902)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    when(mockedRequest.json).thenReturn(async () => {
      return { authorId: 902, name: "テスト出版社902-2" };
    });
    const response = await PUT(instance(mockedRequest), {
      params: { publisherId: 902 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      publisherId: 902,
      name: "テスト出版社902-2",
      books: [],
      relatedAuthors: [],
    });
  });

  test("GET データあり(publisherId:902, データ更新後)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    const response = await GET(instance(mockedRequest), {
      params: { publisherId: 902 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      publisherId: 902,
      name: "テスト出版社902-2",
      books: [],
      relatedAuthors: [],
    });
  });

  test("DELETE データ削除(publisherId:902)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    const response = await DELETE(instance(mockedRequest), {
      params: { publisherId: 902 },
    });
    expect(response.status).toBe(204);
  });

  test("GET データなし(publisherId:902, データ削除後)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    const response = await GET(instance(mockedRequest), {
      params: { publisherId: 902 },
    });
    expect(response.status).toBe(404);
  });

  test("GET データあり(publisherId:900, 関連書籍2件, 関連著者1件)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/900"
    );
    const response = await GET(instance(mockedRequest), {
      params: { publisherId: 900 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      publisherId: 900,
      name: "テスト出版社900",
      books: [
        {
          isbn: "Z00",
          name: "書籍Z00",
          authorId: 801,
          publisherId: 900,
          publishedAt: "2022-09-03T17:06:30.21",
        },
        {
          isbn: "Z01",
          name: "書籍Z01",
          authorId: 801,
          publisherId: 900,
          publishedAt: "2022-09-04T16:07:48.53",
        },
        {
          isbn: "Z03",
          name: "書籍Z03",
          authorId: 800,
          publisherId: 900,
          publishedAt: "2022-09-10T03:05:12.34",
        },
      ],
      relatedAuthors: [
        {
          authorId: 801,
          name: "テスト著者801",
        },
        {
          authorId: 800,
          name: "テスト著者800",
        },
      ],
    });
  });

  test("DELETE データ削除(publisherId:900, 関連書籍2件, 関連著者1件)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/900"
    );
    const response = await DELETE(instance(mockedRequest), {
      params: { publisherId: 900 },
    });
    expect(response.status).toBe(204);
  });

  test("GET データなし(publisherId:900, データ削除後)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/900"
    );
    const response = await GET(instance(mockedRequest), {
      params: { publisherId: 900 },
    });
    expect(response.status).toBe(404);
  });

  test("GET 削除した出版社に紐付いていた書籍も削除されている(isbn:Z00)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z00");
    const response = await booksGET(instance(mockedRequest), {
      params: { isbn: "Z00" },
    });
    expect(response.status).toBe(404);
  });

  test("GET 削除した出版社に紐付いていた書籍も削除されている(isbn:Z01)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
    const response = await booksGET(instance(mockedRequest), {
      params: { isbn: "Z01" },
    });
    expect(response.status).toBe(404);
  });
});
