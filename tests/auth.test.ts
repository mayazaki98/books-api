import { NextRequest } from "next/server";
import { instance, mock, reset, when } from "ts-mockito";

import { DELETE as deleteDELETE } from "@/app/api/auth/delete/route";
import { POST as signinPOST } from "@/app/api/auth/signin/route";
import { POST as signoutPOST } from "@/app/api/auth/signout/route";
import { POST as signupPOST } from "@/app/api/auth/signup/route";
import { POST as updatePOST } from "@/app/api/auth/update/route";

import { POST as authorsPOST } from "@/app/api/authors/route";
import {
  DELETE as authorsDELETE,
  GET as authorsGET,
  PUT as authorsPUT,
} from "@/app/api/authors/[authorId]/route";

import { POST as publishersPOST } from "@/app/api/publishers/route";
import {
  DELETE as publishersDELETE,
  GET as publishersGET,
  PUT as publishersPUT,
} from "@/app/api/publishers/[publisherId]/route";

import { POST as booksPOST } from "@/app/api/books/route";
import {
  DELETE as booksDELETE,
  GET as booksGET,
  PUT as booksPUT,
} from "@/app/api/books/[isbn]/route";
import { testUtilsDeleteTestData, testUtilsCreateTestData } from "./testUtil";
import { supabase } from "@/app/utils/supabase";

jest.mock("../src/app/utils/supabaseAuth");
import * as supabaseAuth from "../src/app/utils/supabaseAuth";

describe("tests auth", () => {
  const mockedRequest: NextRequest = mock(NextRequest);

  beforeAll(async () => {
    //getServerComponentClient は cookie を利用するクライアントを返すが、
    //jest では cookie を利用できないので、cookie を利用しないクライアント
    //を返すようにモックする。
    const walkSpy = jest
      .spyOn(supabaseAuth, "getServerComponentClient")
      .mockReturnValue(supabase);

    await testUtilsCreateTestData();
  }, 10000);

  afterEach(async () => {
    reset(mockedRequest);
  });

  afterAll(async () => {
    await testUtilsDeleteTestData();
  }, 10000);

  test("著者 GET (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");

    const response = await authorsGET(instance(mockedRequest), {
      params: { authorId: 801 },
    });
    expect(response.status).toBe(401);
  });

  test("著者 PUT (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
    when(mockedRequest.json).thenReturn(async () => {
      return { authorId: 801, name: "テスト著者801-2" };
    });
    const response = await authorsPUT(instance(mockedRequest), {
      params: { authorId: 801 },
    });
    expect(response.status).toBe(401);
  });

  test("著者 DELETE (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
    const response = await authorsDELETE(instance(mockedRequest), {
      params: { authorId: 801 },
    });
    expect(response.status).toBe(401);
  });

  test("著者 POST (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors");
    when(mockedRequest.json).thenReturn(async () => {
      return { authorId: 802, name: "テスト著者802" };
    });
    const response = await authorsPOST(instance(mockedRequest));
    expect(response.status).toBe(401);
  });

  test("出版社 GET (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/901"
    );
    const response = await publishersGET(instance(mockedRequest), {
      params: { publisherId: 901 },
    });
    expect(response.status).toBe(401);
  });

  test("出版社 PUT (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/901"
    );
    when(mockedRequest.json).thenReturn(async () => {
      return { authorId: 901, name: "テスト出版社901-2" };
    });
    const response = await publishersPUT(instance(mockedRequest), {
      params: { publisherId: 901 },
    });
    expect(response.status).toBe(401);
  });

  test("出版社 DELETE (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/901"
    );
    const response = await publishersDELETE(instance(mockedRequest), {
      params: { publisherId: 901 },
    });
    expect(response.status).toBe(401);
  });

  test("出版社 POST (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/902"
    );
    when(mockedRequest.json).thenReturn(async () => {
      return { publisherId: 902, name: "テスト出版社902" };
    });
    const response = await publishersPOST(instance(mockedRequest));
    expect(response.status).toBe(401);
  });

  test("書籍 GET (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
    const response = await booksGET(instance(mockedRequest), {
      params: { isbn: "Z01" },
    });
    expect(response.status).toBe(401);
  });

  test("書籍 PUT (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        isbn: "Z01",
        name: "書籍Z01-2",
        authorId: 801,
        publisherId: 900,
        publishedAt: "2024-02-25T13:14:15.16",
      };
    });
    const response = await booksPUT(instance(mockedRequest), {
      params: { isbn: "Z01" },
    });
    expect(response.status).toBe(401);
  });

  test("書籍 DELETE (サインインなし)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
    const response = await booksDELETE(instance(mockedRequest), {
      params: { isbn: "Z01" },
    });
    expect(response.status).toBe(401);
  });

  test("書籍 POST (サインインなし)", async () => {
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
    const response = await booksPOST(instance(mockedRequest));
    expect(response.status).toBe(401);
  });

  test("サインアップ POST (test91@booksapi.test.com)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/signup");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        email: "test91@booksapi.test.com",
        password: "qn3hinU12.8n",
      };
    });
    const response = await signupPOST(instance(mockedRequest));
    expect(response.status).toBe(201);
  }, 10000);

  test("出版社 GET (サインアップ後)", async () => {
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

  test("パスワード更新 POST (test91@booksapi.test.com)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/update");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        password: "qn3hinU12.8n-2",
      };
    });
    const response = await updatePOST(instance(mockedRequest));
    expect(response.status).toBe(200);
  }, 10000);

  test("サインアウト POST (test91@booksapi.test.com)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/auth/signout"
    );
    const response = await signoutPOST(instance(mockedRequest));
    expect(response.status).toBe(200);
  }, 10000);

  test("出版社 GET (サインアウト後)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/901"
    );
    const response = await publishersGET(instance(mockedRequest), {
      params: { publisherId: 901 },
    });
    expect(response.status).toBe(401);
  }, 10000);

  test("サインイン POST (test01@booksapi.test.com, パスワード更新後)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/signin");
    when(mockedRequest.json).thenReturn(async () => {
      return {
        email: "test91@booksapi.test.com",
        password: "qn3hinU12.8n-2",
      };
    });
    const response = await signinPOST(instance(mockedRequest));
    expect(response.status).toBe(200);
  }, 10000);

  test("出版社 GET (サインイン後)", async () => {
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
  }, 10000);

  test("ユーザー削除 DELETE (test91@booksapi.test.com)", async () => {
    when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/delete");
    const response = await deleteDELETE(instance(mockedRequest));
    expect(response.status).toBe(204);
  }, 10000);

  test("出版社 GET (ユーザー削除後)", async () => {
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
  }, 10000);

  test("サインアウト POST (test91@booksapi.test.com, ユーザー削除後)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/auth/signout"
    );
    const response = await signoutPOST(instance(mockedRequest));
    expect(response.status).toBe(200);
  }, 10000);

  test("出版社 GET (ユーザー削除, サインアウト後)", async () => {
    when(mockedRequest.url).thenReturn(
      "http://localhost:3000/api/publishers/901"
    );
    const response = await publishersGET(instance(mockedRequest), {
      params: { publisherId: 901 },
    });
    expect(response.status).toBe(401);
  }, 10000);
});
