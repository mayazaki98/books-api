import { NextRequest } from "next/server";
import { POST } from "@/app/api/books/route";
import { DELETE, GET, PUT } from "@/app/api/books/[isbn]/route";
import { GET as authorsGET } from "@/app/api/authors/[authorId]/route";
import { GET as publishersGET } from "@/app/api/publishers/[publisherId]/route";
import { instance, mock, reset, when } from "ts-mockito";
import {
  testUtilsSignOut,
  testUtilsDeleteTestData,
  testUtilSignIn,
  testUtilsCreateTestData,
  sleep,
} from "./testUtil";

describe("tests books", () => {
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

  test("GET データなし(isbn:Z02, データ作成前)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z02");
    const response = await GET(instance(mockedRequest), {
      params: { isbn: "Z02" },
    });
    expect(response.status).toBe(404);
  });

  test("POST データ作成(isbn:Z02)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        isbn: "Z02",
        name: "書籍Z02",
        authorId: 800,
        publisherId: 900,
        publishedAt: "2024-02-24T19:00:35.15",
      };
    });
    const response = await POST(instance(mockedRequest));
    expect(response.status).toBe(201);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      isbn: "Z02",
      name: "書籍Z02",
      authorId: 800,
      publisherId: 900,
      publishedAt: "2024-02-24T19:00:35.15",
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

  test("GET データあり(isbn:Z02, データ作成後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z02");
    const response = await GET(instance(mockedRequest), {
      params: { isbn: "Z02" },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      isbn: "Z02",
      name: "書籍Z02",
      authorId: 800,
      publisherId: 900,
      publishedAt: "2024-02-24T19:00:35.15",
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

  test("PUT データ更新(isbn:Z02)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z02");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        isbn: "Z02",
        name: "書籍Z02-2",
        authorId: 801,
        publisherId: 901,
        publishedAt: "2024-02-25T13:14:15.16",
      };
    });
    const response = await PUT(instance(mockedRequest), {
      params: { isbn: "Z02" },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      isbn: "Z02",
      name: "書籍Z02-2",
      authorId: 801,
      publisherId: 901,
      publishedAt: "2024-02-25T13:14:15.16",
      authors: {
        authorId: 801,
        name: "テスト著者801",
      },
      publishers: {
        publisherId: 901,
        name: "テスト出版社901",
      },
    });
  });

  test("GET データあり(isbn:Z02, データ更新後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z02");
    const response = await GET(instance(mockedRequest), {
      params: { isbn: "Z02" },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      isbn: "Z02",
      name: "書籍Z02-2",
      authorId: 801,
      publisherId: 901,
      publishedAt: "2024-02-25T13:14:15.16",
      authors: {
        authorId: 801,
        name: "テスト著者801",
      },
      publishers: {
        publisherId: 901,
        name: "テスト出版社901",
      },
    });
  });

  test("DELETE データ削除(isbn:Z02)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z02");
    const response = await DELETE(instance(mockedRequest), {
      params: { isbn: "Z02" },
    });
    expect(response.status).toBe(204);
  });

  test("GET データなし(isbn:Z02, データ削除後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z02");
    const response = await GET(instance(mockedRequest), {
      params: { isbn: "Z02" },
    });
    expect(response.status).toBe(404);
  });

  test("GET 削除した出版社に紐付いていた著者は削除されていない(authorId:801)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
    const response = await authorsGET(instance(mockedRequest), {
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

  test("GET 削除した出版社に紐付いていた著者は削除されていない(publisherId:901)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/901"
    );
    const response = await publishersGET(instance(mockedRequest), {
      params: { publisherId: 901 },
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(await response.text());
    expect(json).toEqual({
      publisherId: 901,
      name: "テスト出版社901",
      books: [],
      relatedAuthors: [],
    });
  });
});
