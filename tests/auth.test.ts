import { NextRequest, NextResponse } from "next/server";
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
import {
  testUtilsDeleteTestData,
  testUtilsCreateTestData,
  testUtilSignIn,
  testUtilsSignOut,
  testUtilsSendRequest,
} from "./testUtil";
import { ResultGetUser, ResultSupabase } from "@/app/utils/supabase";
// import { jest, test } from "@jest/globals";
// import { cookies } from "next/headers";
//import { getSession } from "@/app/utils/supabaseGetSession";
//const { supabaseGetSession } = require("../src/app/utils/supabaseGetSession");
//const { getUser } = require("../src/app/utils/supa");
//jest.mock("../src/app/utils/supabaseGetSession");
//import { getUser } from "../src/app/utils/supabase";
const { getUser } = require("../src/app/utils/supabase"); // 仮のモジュール名とパス
jest.mock("../src/app/utils/supabase"); // 仮のモジュール名とパス

describe("tests auth", () => {
  const mockedRequest: NextRequest = mock(NextRequest);
  // const supabaseGetSessionMock = supabaseGetSession as jest.Mocked<
  //   typeof supabaseGetSession
  // >;
  let signedInUser: { email: string; id: string };

  beforeAll(async () => {
    ///await testUtilsCreateTestData();
  }, 10000);

  afterEach(() => {
    reset(mockedRequest);
  });

  test("出版社 GET (サインイン後)", async () => {
    signedInUser = { email: "abc", id: "123" };

    let mockResult: ResultGetUser = {
      result: ResultSupabase.Success,
      data: { email: "0", id: "a" },
    };
    getUser.mockResolvedValueOnce(mockResult); // モックの戻り値は必要に応じて設定

    // jest.spyOn(supabaseAuth_.auth, "getSession").mockResolvedValueOnce({
    //   data: {
    //     session: {
    //       access_token:
    //         "eyJhbGciOiJIUzI1NiIsImtpZCI6Ijc3czg0cWNKcFlVZTRWM0kiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA4ODU2MDg3LCJpYXQiOjE3MDg4NTI0ODcsImlzcyI6Imh0dHBzOi8vaWtxemtvbnpsbGVyeGdjZm5jbW0uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjhlZjQwZGQ0LWVlOTYtNDAyMy05ZjRjLWI1ZmQzOGQxNjM1OCIsImVtYWlsIjoidGVzdDkxQGJvb2tzYXBpLnRlc3QuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MDg4NTI0ODd9XSwic2Vzc2lvbl9pZCI6IjllZGFlYzI3LTU0YmMtNDNhMy1iOTNlLTM0MGRmYzFlNjRkOCJ9.w_Rh3iRqqcZo5xt7qrC47y3PkuhzF1D39gXJcGPZS4s",
    //       token_type: "bearer",
    //       expires_in: 3600,
    //       expires_at: 1708856087,
    //       refresh_token: "rEtTNYZBeKsKZdAtfhhjBA",
    //       user: {
    //         id: "8ef40dd4-ee96-4023-9f4c-b5fd38d16358",
    //         aud: "authenticated",
    //         role: "authenticated",
    //         email: "test91@booksapi.test.com",
    //         email_confirmed_at: "2024-02-25T08:31:32.167183Z",
    //         phone: "",
    //         confirmed_at: "2024-02-25T08:31:32.167183Z",
    //         last_sign_in_at: "2024-02-25T09:14:47.955831039Z",
    //         app_metadata: {},
    //         user_metadata: {},
    //         identities: [],
    //         created_at: "2024-02-25T08:31:32.163843Z",
    //         updated_at: "2024-02-25T09:14:47.957831Z",
    //       },
    //     },
    //   },
    //   error: null,
    // });

    // getSession.mockResolvedValue({
    //   data: {
    //     session: {
    //       access_token:
    //         "eyJhbGciOiJIUzI1NiIsImtpZCI6Ijc3czg0cWNKcFlVZTRWM0kiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA4ODU2MDg3LCJpYXQiOjE3MDg4NTI0ODcsImlzcyI6Imh0dHBzOi8vaWtxemtvbnpsbGVyeGdjZm5jbW0uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjhlZjQwZGQ0LWVlOTYtNDAyMy05ZjRjLWI1ZmQzOGQxNjM1OCIsImVtYWlsIjoidGVzdDkxQGJvb2tzYXBpLnRlc3QuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MDg4NTI0ODd9XSwic2Vzc2lvbl9pZCI6IjllZGFlYzI3LTU0YmMtNDNhMy1iOTNlLTM0MGRmYzFlNjRkOCJ9.w_Rh3iRqqcZo5xt7qrC47y3PkuhzF1D39gXJcGPZS4s",
    //       token_type: "bearer",
    //       expires_in: 3600,
    //       expires_at: 1708856087,
    //       refresh_token: "rEtTNYZBeKsKZdAtfhhjBA",
    //       user: {
    //         id: "8ef40dd4-ee96-4023-9f4c-b5fd38d16358",
    //         aud: "authenticated",
    //         role: "authenticated",
    //         email: "test91@booksapi.test.com",
    //         email_confirmed_at: "2024-02-25T08:31:32.167183Z",
    //         phone: "",
    //         confirmed_at: "2024-02-25T08:31:32.167183Z",
    //         last_sign_in_at: "2024-02-25T09:14:47.955831039Z",
    //         app_metadata: {},
    //         user_metadata: {},
    //         identities: [],
    //         created_at: "2024-02-25T08:31:32.163843Z",
    //         updated_at: "2024-02-25T09:14:47.957831Z",
    //       },
    //     },
    //   },
    //   error: null,
    // });

    //const { data, error } = await getSession();

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

  // afterAll(async () => {
  //   await testUtilsDeleteTestData();
  // }, 10000);

  // test("著者 GET (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
  //   const response = await authorsGET(instance(mockedRequest), {
  //     params: { authorId: 801 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("著者 PUT (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return { authorId: 801, name: "テスト著者801-2" };
  //   });
  //   const response = await authorsPUT(instance(mockedRequest), {
  //     params: { authorId: 801 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("著者 DELETE (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors/801");
  //   const response = await authorsDELETE(instance(mockedRequest), {
  //     params: { authorId: 801 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("著者 POST (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/authors");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return { authorId: 802, name: "テスト著者802" };
  //   });
  //   const response = await authorsPOST(instance(mockedRequest));
  //   expect(response.status).toBe(401);
  // });

  // test("出版社 GET (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("出版社 PUT (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return { authorId: 901, name: "テスト出版社901-2" };
  //   });
  //   const response = await publishersPUT(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("出版社 DELETE (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersDELETE(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("出版社 POST (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/902"
  //   );
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return { publisherId: 902, name: "テスト出版社902" };
  //   });
  //   const response = await publishersPOST(instance(mockedRequest));
  //   expect(response.status).toBe(401);
  // });

  // test("書籍 GET (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
  //   const response = await booksGET(instance(mockedRequest), {
  //     params: { isbn: "Z01" },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("書籍 PUT (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return {
  //       isbn: "Z01",
  //       name: "書籍Z01-2",
  //       authorId: 801,
  //       publisherId: 900,
  //       publishedAt: "2024-02-25T13:14:15.16",
  //     };
  //   });
  //   const response = await booksPUT(instance(mockedRequest), {
  //     params: { isbn: "Z01" },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("書籍 DELETE (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/books/Z01");
  //   const response = await booksDELETE(instance(mockedRequest), {
  //     params: { isbn: "Z01" },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("書籍 POST (サインインなし)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/books");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return {
  //       isbn: "Z02",
  //       name: "書籍Z02",
  //       authorId: 800,
  //       publisherId: 900,
  //       publishedAt: "2024-02-24T19:00:35.15",
  //     };
  //   });
  //   const response = await booksPOST(instance(mockedRequest));
  //   expect(response.status).toBe(401);
  // });

  // test("サインアップ POST (test91@booksapi.test.com)", async () => {
  //   mockedRequest.cookies;
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/signup");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return {
  //       email: "test91@booksapi.test.com",
  //       password: "qn3hinU12.8n",
  //     };
  //   });
  //   const response = await signupPOST(instance(mockedRequest));
  //   expect(response.status).toBe(201);
  // });

  // test("出版社 GET (サインアップ後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(200);
  //   const json = JSON.parse(await response.text());
  //   expect(json).toEqual({
  //     publisherId: 901,
  //     name: "テスト出版社901",
  //     books: [],
  //     relatedAuthors: [],
  //   });
  // });

  // test("パスワード更新 POST (test91@booksapi.test.com)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/update");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return {
  //       password: "qn3hinU12.8n-2",
  //     };
  //   });
  //   const response = await updatePOST(instance(mockedRequest));
  //   expect(response.status).toBe(200);
  // });

  // test("サインアウト POST (test91@booksapi.test.com)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/auth/signout"
  //   );
  //   const response = await signoutPOST(instance(mockedRequest));
  //   expect(response.status).toBe(200);
  // });

  // test("出版社 GET (サインアウト後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("サインイン POST (test01@booksapi.test.com, パスワード更新後)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/signin");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return {
  //       email: "test91@booksapi.test.com",
  //       password: "qn3hinU12.8n-2",
  //     };
  //   });
  //   const response = await signinPOST(instance(mockedRequest));
  //   expect(response.status).toBe(200);
  // });

  // test("ユーザー削除 DELETE (test91@booksapi.test.com)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/delete");
  //   const response = await deleteDELETE(instance(mockedRequest));
  //   expect(response.status).toBe(204);
  // });

  // test("出版社 GET (ユーザー削除後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(200);
  //   const json = JSON.parse(await response.text());
  //   expect(json).toEqual({
  //     publisherId: 901,
  //     name: "テスト出版社901",
  //     books: [],
  //     relatedAuthors: [],
  //   });
  // });

  // test("サインアウト POST (test91@booksapi.test.com, ユーザー削除後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/auth/signout"
  //   );
  //   const response = await signoutPOST(instance(mockedRequest));
  //   expect(response.status).toBe(200);
  // });

  // test("出版社 GET (ユーザー削除, サインアウト後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("サインアップ POST (test91@booksapi.test.com)", async () => {
  //   const { response, json } = await testUtilsSendRequest(
  //     "http://localhost:3000/api/auth/signup",
  //     "POST",
  //     {
  //       email: "test91@booksapi.test.com",
  //       password: "qn3hinU12.8n",
  //     }
  //   );
  //   expect(response.status).toBe(201);
  //   expect(json).toEqual({ email: "test91@booksapi.test.com" });
  // });

  // test("サインイン POST (test01@booksapi.test.com)", async () => {
  //   const { response, json } = await testUtilsSendRequest(
  //     "http://localhost:3000/api/auth/signin",
  //     "POST",
  //     {
  //       email: "test91@booksapi.test.com",
  //       password: "qn3hinU12.8n",
  //     }
  //   );
  //   expect(response.status).toBe(200);
  //   signedInUser = json as { email: string; id: string };
  // });

  test("出版社 GET (サインアップ後)", async () => {
    signedInUser = { email: "abc", id: "123" };

    let mockResult: ResultGetUser = {
      result: ResultSupabase.Success,
      data: { email: "0", id: "a" },
    };
    getUser.mockResolvedValueOnce(mockResult); // モックの戻り値は必要に応じて設定

    const { response, json } = await testUtilsSendRequest(
      "http://localhost:3000/api/publishers/901",
      "GET",
      null
    );
    expect(response.status).toBe(200);
    expect(json).toEqual({
      publisherId: 901,
      name: "テスト出版社901",
      books: [],
      relatedAuthors: [],
    });
  });

  // test("パスワード更新 POST (test91@booksapi.test.com)", async () => {
  //   const { response, json } = await testUtilsSendRequest(
  //     "http://localhost:3000/api/auth/update",
  //     "POST",
  //     { password: "qn3hinU12.8n-2" }
  //   );
  //   expect(response.status).toBe(200);
  // });

  // test("サインアウト POST (test91@booksapi.test.com)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/auth/signout"
  //   );
  //   const response = await signoutPOST(instance(mockedRequest));
  //   expect(response.status).toBe(200);
  // });

  // test("出版社 GET (サインアウト後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(401);
  // });

  // test("サインイン POST (test01@booksapi.test.com, パスワード更新後)", async () => {
  //   when(mockedRequest.url).thenReturn("http://localhost:3000/api/auth/signin");
  //   when(mockedRequest.json).thenReturn(async () => {
  //     return {
  //       email: "test91@booksapi.test.com",
  //       password: "qn3hinU12.8n-2",
  //     };
  //   });
  //   const response = await signinPOST(instance(mockedRequest));
  //   expect(response.status).toBe(200);
  // });

  // test("出版社 GET (サインイン後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(200);
  //   const json = JSON.parse(await response.text());
  //   expect(json).toEqual({
  //     publisherId: 901,
  //     name: "テスト出版社901",
  //     books: [],
  //     relatedAuthors: [],
  //   });
  // });

  // test("ユーザー削除 DELETE (test91@booksapi.test.com)", async () => {
  //   const { response, json } = await testUtilsSendRequest(
  //     "http://localhost:3000/api/auth/delete",
  //     "DELETE",
  //     null
  //   );
  //   expect(response.status).toBe(204);
  // });

  // test("出版社 GET (ユーザー削除後)", async () => {
  //   when(mockedRequest.url).thenReturn(
  //     "http://localhost:3000/api/publishers/901"
  //   );
  //   const response = await publishersGET(instance(mockedRequest), {
  //     params: { publisherId: 901 },
  //   });
  //   expect(response.status).toBe(200);
  //   const json = JSON.parse(await response.text());
  //   expect(json).toEqual({
  //     publisherId: 901,
  //     name: "テスト出版社901",
  //     books: [],
  //     relatedAuthors: [],
  //   });
});

// test("サインアウト POST (test91@booksapi.test.com, ユーザー削除後)", async () => {
//   when(mockedRequest.url).thenReturn(
//     "http://localhost:3000/api/auth/signout"
//   );
//   const response = await signoutPOST(instance(mockedRequest));
//   expect(response.status).toBe(200);
// });

// test("出版社 GET (ユーザー削除, サインアウト後)", async () => {
//   when(mockedRequest.url).thenReturn(
//     "http://localhost:3000/api/publishers/901"
//   );
//   const response = await publishersGET(instance(mockedRequest), {
//     params: { publisherId: 901 },
//   });
//   expect(response.status).toBe(401);
// });
