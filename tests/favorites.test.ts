import { NextRequest } from "next/server";
import { DELETE, GET, PUT, POST } from "@/app/api/favorites/route";
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

describe("tests books", () => {
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

  test("GET データなし(データ作成前)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    const response = await GET(instance(mockedRequest));
    expect(response.status).toBe(404);
  });

  test("POST データ作成(isbn:Z00)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        isbn: "Z00",
      };
    });
    const response = await POST(instance(mockedRequest));
    expect(response.status).toBe(201);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      isbn: "Z00",
      name: "書籍Z00",
      authorId: 801,
      publisherId: 900,
      publishedAt: "2022-09-03T17:06:30.21",
      authors: {
        authorId: 801,
        name: "テスト著者801",
      },
      publishers: {
        publisherId: 900,
        name: "テスト出版社900",
      },
    });
  });

  test("GET データあり(isbn:Z00)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    const response = await GET(instance(mockedRequest));
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual([
      {
        isbn: "Z00",
        name: "書籍Z00",
        authorId: 801,
        publisherId: 900,
        publishedAt: "2022-09-03T17:06:30.21",
        authors: {
          authorId: 801,
          name: "テスト著者801",
        },
        publishers: {
          publisherId: 900,
          name: "テスト出版社900",
        },
      },
    ]);
  });

  test("POST データ作成(isbn:Z01)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        isbn: "Z01",
      };
    });
    const response = await POST(instance(mockedRequest));
    expect(response.status).toBe(201);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      isbn: "Z01",
      name: "書籍Z01",
      authorId: 801,
      publisherId: 900,
      publishedAt: "2022-09-04T16:07:48.53",
      authors: {
        authorId: 801,
        name: "テスト著者801",
      },
      publishers: {
        publisherId: 900,
        name: "テスト出版社900",
      },
    });
  });

  test("GET データあり(isbn:Z00,Z01)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    const response = await GET(instance(mockedRequest));
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual([
      {
        isbn: "Z00",
        name: "書籍Z00",
        authorId: 801,
        publisherId: 900,
        publishedAt: "2022-09-03T17:06:30.21",
        authors: {
          authorId: 801,
          name: "テスト著者801",
        },
        publishers: {
          publisherId: 900,
          name: "テスト出版社900",
        },
      },
      {
        isbn: "Z01",
        name: "書籍Z01",
        authorId: 801,
        publisherId: 900,
        publishedAt: "2022-09-04T16:07:48.53",
        authors: {
          authorId: 801,
          name: "テスト著者801",
        },
        publishers: {
          publisherId: 900,
          name: "テスト出版社900",
        },
      },
    ]);
  });

  test("PUT データ更新(isbn:Z01->Z03)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        isbnFrom: "Z01",
        isbnTo: "Z03",
      };
    });
    const response = await PUT(instance(mockedRequest));
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      isbn: "Z03",
      name: "書籍Z03",
      authorId: 800,
      publisherId: 900,
      publishedAt: "2022-09-10T03:05:12.34",
      authors: {
        authorId: 800,
        name: "テスト著者800",
      },
      publishers: {
        publisherId: 900,
        name: "テスト出版社900",
      },
    });
  });

  test("GET データあり(isbn:Z00,Z03)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    const response = await GET(instance(mockedRequest));
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual([
      {
        isbn: "Z00",
        name: "書籍Z00",
        authorId: 801,
        publisherId: 900,
        publishedAt: "2022-09-03T17:06:30.21",
        authors: {
          authorId: 801,
          name: "テスト著者801",
        },
        publishers: {
          publisherId: 900,
          name: "テスト出版社900",
        },
      },
      {
        isbn: "Z03",
        name: "書籍Z03",
        authorId: 800,
        publisherId: 900,
        publishedAt: "2022-09-10T03:05:12.34",
        authors: {
          authorId: 800,
          name: "テスト著者800",
        },
        publishers: {
          publisherId: 900,
          name: "テスト出版社900",
        },
      },
    ]);
  });

  test("DELETE データ削除(isbn:Z00)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z02");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        isbn: "Z00",
      };
    });
    const response = await DELETE(instance(mockedRequest));
    expect(response.status).toBe(204);
  });

  test("GET データあり(isbn:Z03)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/favorites");
    const response = await GET(instance(mockedRequest));
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual([
      {
        isbn: "Z03",
        name: "書籍Z03",
        authorId: 800,
        publisherId: 900,
        publishedAt: "2022-09-10T03:05:12.34",
        authors: {
          authorId: 800,
          name: "テスト著者800",
        },
        publishers: {
          publisherId: 900,
          name: "テスト出版社900",
        },
      },
    ]);
  });
});
