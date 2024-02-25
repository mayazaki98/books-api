import { NextRequest } from "next/server";
import { POST } from "@/app/api/authors/route";
import { DELETE, GET, PUT } from "@/app/api/authors/[authorId]/route";
import { GET as booksGET } from "@/app/api/books/[isbn]/route";
import { instance, mock, reset, when } from "ts-mockito";
import {
  testUtilsSignOut,
  testUtilsDeleteTestData,
  testUtilSignIn,
  testUtilsCreateTestData,
  sleep,
} from "./testUtil";

describe("tests authors", () => {
  const mockedRequest: NextRequest = mock(NextRequest);

  beforeAll(async () => {
    await testUtilSignIn(mockedRequest);
    await testUtilsDeleteTestData();
    await sleep(500);
    await testUtilsCreateTestData();
    await sleep(500);
  }, 10000);

  afterEach(async () => {
    reset(mockedRequest);
    await sleep(500);
  });

  afterAll(async () => {
    await testUtilsDeleteTestData();
    await testUtilsSignOut(mockedRequest);
  }, 10000);

  // test("データ作成", async () => {
  //   await initializeTestData();
  // }, 10000);

  test("GET データなし(authorId:802, データ作成前)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/802");
    const response = await GET(instance(mockedRequest), {
      params: { authorId: 802 },
    });
    expect(response.status).toBe(404);
  });

  test("POST データ作成(authorId:802)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors");
    when(mockedRequest.json).thenReturn(async () => {
      return { authorId: 802, name: "テスト著者802" };
    });
    const response = await POST(instance(mockedRequest));
    expect(response.status).toBe(201);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      authorId: 802,
      name: "テスト著者802",
      books: [],
      relatedPublishers: [],
    });
  });

  test("GET データあり(authorId:802, データ作成後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/802");
    const response = await GET(instance(mockedRequest), {
      params: { authorId: 802 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      authorId: 802,
      name: "テスト著者802",
      books: [],
      relatedPublishers: [],
    });
  });

  test("PUT データ更新(authorId:802)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/802");
    when(mockedRequest.json).thenReturn(async () => {
      return { authorId: 802, name: "テスト著者802-2" };
    });
    const response = await PUT(instance(mockedRequest), {
      params: { authorId: 802 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      authorId: 802,
      name: "テスト著者802-2",
      books: [],
      relatedPublishers: [],
    });
  });

  test("GET データあり(authorId:802, データ更新後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/802");
    const response = await GET(instance(mockedRequest), {
      params: { authorId: 802 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      authorId: 802,
      name: "テスト著者802-2",
      books: [],
      relatedPublishers: [],
    });
  });

  test("DELETE データ削除(authorId:802)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/802");
    const response = await DELETE(instance(mockedRequest), {
      params: { authorId: 802 },
    });
    expect(response.status).toBe(204);
  });

  test("GET データなし(authorId:802, データ削除後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/802");
    const response = await GET(instance(mockedRequest), {
      params: { authorId: 802 },
    });
    expect(response.status).toBe(404);
  });

  test("GET データあり(authorId:801, 関連書籍2件, 関連出版社1件)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
    const response = await GET(instance(mockedRequest), {
      params: { authorId: 801 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      authorId: 801,
      name: "テスト著者801",
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
      ],
      relatedPublishers: [
        {
          publisherId: 900,
          name: "テスト出版社900",
        },
      ],
    });
  });

  test("DELETE データ削除(authorId:801, 関連書籍2件, 関連出版社1件)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
    const response = await DELETE(instance(mockedRequest), {
      params: { authorId: 801 },
    });
    expect(response.status).toBe(204);
  });

  test("GET データなし(authorId:801, データ削除後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
    const response = await GET(instance(mockedRequest), {
      params: { authorId: 801 },
    });
    expect(response.status).toBe(404);
  });

  test("GET 削除した著者に紐付いていた書籍も削除されている(isbn:Z00)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z00");
    const response = await booksGET(instance(mockedRequest), {
      params: { isbn: "Z00" },
    });
    expect(response.status).toBe(404);
  });

  test("GET 削除した著者に紐付いていた書籍も削除されている(isbn:Z01)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
    const response = await booksGET(instance(mockedRequest), {
      params: { isbn: "Z01" },
    });
    expect(response.status).toBe(404);
  });
});
