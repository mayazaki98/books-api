import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabaseSchema";
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
);

//export const supabaseAuth_ = createServerComponentClient({ cookies });

/**
 * Supabase実行結果
 */
export enum ResultSupabase {
  Error,
  Nothing,
  Success,
}

export type BooksRow = Database["public"]["Tables"]["books"]["Row"];
export type BooksUpdate = Database["public"]["Tables"]["books"]["Update"];
export type BooksInsert = Database["public"]["Tables"]["books"]["Insert"];
export type AuthorsRow = Database["public"]["Tables"]["authors"]["Row"];
export type AuthorsUpdate = Database["public"]["Tables"]["authors"]["Update"];
export type AuthorsInsert = Database["public"]["Tables"]["authors"]["Insert"];
export type PublishersRow = Database["public"]["Tables"]["publishers"]["Row"];
export type PublishersUpdate =
  Database["public"]["Tables"]["publishers"]["Update"];
export type PublishersInsert =
  Database["public"]["Tables"]["publishers"]["Insert"];

export type BooksRowResult = BooksRow & {
  authors: AuthorsRow | null;
  publishers: PublishersRow | null;
};

export type AuthorsRowResult = AuthorsRow & {
  books: BooksRow[];
  relatedPublishers: PublishersRow[];
};

export type PublishersRowResult = PublishersRow & {
  books: BooksRow[];
  relatedAuthors: AuthorsRow[];
};

export type BooksWithAuthorsRow = BooksRow & {
  authors: AuthorsRow | null;
};

export type BooksWithPublishersRow = BooksRow & {
  publishers: PublishersRow | null;
};

export type AuthorsWithBooksRow = AuthorsRow & {
  books: BooksWithPublishersRow[];
};

export type PublishersRowWithBooksRow = PublishersRow & {
  books: BooksWithAuthorsRow[];
};

/**
 * 書籍データ取得結果
 */
export type ResultGetBook = {
  result: ResultSupabase;
  data: BooksRowResult | null;
};

/**
 * 著者データ取得結果
 */
export type ResultGetAuthor = {
  result: ResultSupabase;
  data: AuthorsRowResult | null;
};

/**
 * 著者データ取得結果
 */
export type ResultGetPublisher = {
  result: ResultSupabase;
  data: PublishersRowResult | null;
};

export type UserRow = {
  email: string;
  id: string;
};

/**
 * ユーザーデータ取得結果
 */
export type ResultGetUser = {
  result: ResultSupabase;
  data: UserRow | null;
};

/**
 * 書籍データ取得
 * @param isbn ISBN
 * @returns 書籍データ取得結果
 */
export const getBook = async (isbn: string): Promise<ResultGetBook> => {
  let res: ResultGetBook = {
    result: ResultSupabase.Error,
    data: null,
  };

  const { data, error } = await supabase
    .from("books")
    .select(
      ` 
        isbn,
        name,
        publishedAt,
        authorId,
        publisherId,
        authors (
          authorId,
          name
        ),
        publishers (
          publisherId,
          name
        )
      `
    )
    .filter("isbn", "eq", isbn);

  console.log(
    `getBook data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`getBook exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`getBook data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`getBook data count is zero`);
      res.result = ResultSupabase.Nothing;
      return res;

    case 1:
      console.log(`getBook find data`);
      res.result = ResultSupabase.Success;
      res.data = data[0];
      return res;

    default:
      console.log(`getBook data count is unexpected(${data.length})`);
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 書籍データ更新
 * @param isbn ISBN
 * @param book 書籍データ
 * @returns 書籍データ更新結果
 */
export const updateBook = async (
  isbn: string,
  book: BooksUpdate
): Promise<ResultGetBook> => {
  let res: ResultGetBook = {
    result: ResultSupabase.Error,
    data: null,
  };
  const { data, error } = await supabase
    .from("books")
    .update({
      isbn: book.isbn,
      name: book.name,
      authorId: book.authorId,
      publisherId: book.publisherId,
      publishedAt: book.publishedAt,
    })
    .eq("isbn", isbn)
    .select(
      ` 
        isbn,
        name,
        publishedAt,
        authorId,
        publisherId,
        authors (
          authorId,
          name
        ),
        publishers (
          publisherId,
          name
        )
      `
    );

  console.log(
    `updateBook data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateBook exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`updateBook updated data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`updateBook updated data count is zero`);
      res.result = ResultSupabase.Nothing;
      return res;

    case 1:
      console.log(`updateBook find updated data`);
      res.data = data[0];
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(
        `updateBook updated data count is unexpected(${data.length})`
      );
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 書籍データ追加
 * @param book 書籍データ
 * @returns 書籍データ追加結果
 */
export const insertBook = async (book: BooksInsert): Promise<ResultGetBook> => {
  let res: ResultGetBook = {
    result: ResultSupabase.Error,
    data: null,
  };
  const { data, error } = await supabase
    .from("books")
    .insert({
      isbn: book.isbn,
      name: book.name,
      authorId: book.authorId,
      publisherId: book.publisherId,
      publishedAt: book.publishedAt,
    })
    .select(
      ` 
        isbn,
        name,
        publishedAt,
        authorId,
        publisherId,
        authors (
          authorId,
          name
        ),
        publishers (
          publisherId,
          name
        )
      `
    );

  console.log(
    `updateBook data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateBook exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`updateBook inserted data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`updateBook inserted data count is zero`);
      res.result = ResultSupabase.Error;
      return res;

    case 1:
      console.log(`updateBook find inserted data`);
      res.data = data[0];
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(
        `updateBook inserted data count is unexpected(${data.length})`
      );
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 書籍データ削除
 * @param isbn ISBN
 * @returns 書籍データ削除結果
 */
export const deleteBook = async (isbn: string): Promise<ResultSupabase> => {
  const { error } = await supabase.from("books").delete().eq("isbn", isbn);
  console.log(`deleteBook error=${JSON.stringify(error)}`);

  if (error) {
    console.log(`deleteBook exists error`);
    return ResultSupabase.Error;
  }

  return ResultSupabase.Success;
};

/**
 * 著者のクエリ取得結果からレスポンス結果へ変換する
 * @param src 著者のクエリ取得結果
 * @returns 著者のレスポンス結果
 */
const convertAuthorToResult = (src: AuthorsWithBooksRow): AuthorsRowResult => {
  let dst: AuthorsRowResult = {
    authorId: src.authorId,
    name: src.name,
    books: [],
    relatedPublishers: [],
  };

  for (const books of src.books) {
    dst.books.push({
      isbn: books.isbn,
      name: books.name,
      publishedAt: books.publishedAt,
      authorId: books.authorId,
      publisherId: books.publisherId,
    });
    if (books.publishers) {
      if (
        !dst.relatedPublishers.find(
          (element) => element.publisherId === books.publisherId
        )
      ) {
        dst.relatedPublishers.push(books.publishers);
      }
    }
  }

  return dst;
};

/**
 * 著者データ取得
 * @param authorId 著者ID
 * @returns 著者データ取得結果
 */
export const getAuthor = async (authorId: number): Promise<ResultGetAuthor> => {
  let res: ResultGetAuthor = {
    result: ResultSupabase.Error,
    data: null,
  };

  const { data, error } = await supabase
    .from("authors")
    .select(
      `
        authorId, 
        name,
        books (
          isbn,
          name,
          publishedAt,
          authorId,
          publisherId,
          publishers (
            publisherId,
            name
          )
        )`
    )
    .filter("authorId", "eq", authorId);

  console.log(
    `getAuthor data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`getAuthor exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`getAuthor data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`getAuthor data count is zero`);
      res.result = ResultSupabase.Nothing;
      return res;

    case 1:
      console.log(`getAuthor find data`);
      res.data = convertAuthorToResult(data[0]);
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(`getAuthor data count is unexpected(${data.length})`);
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 著者データ更新
 * @param authorId 著者ID
 * @param author 著者データ
 * @returns 著者データ更新結果
 */
export const updateAuthor = async (
  authorId: number,
  author: AuthorsUpdate
): Promise<ResultGetAuthor> => {
  let res: ResultGetAuthor = {
    result: ResultSupabase.Error,
    data: null,
  };
  const { data, error } = await supabase
    .from("authors")
    .update({
      authorId: author.authorId,
      name: author.name,
    })
    .eq("authorId", authorId)
    .select(
      `
        authorId, 
        name,
        books (
          isbn,
          name,
          publishedAt,
          authorId,
          publisherId,
          publishers (
            publisherId,
            name
          )
        )`
    );

  console.log(
    `updateAuthor data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateAuthor exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`updateAuthor updated data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`updateAuthor updated data count is zero`);
      res.result = ResultSupabase.Nothing;
      return res;

    case 1:
      console.log(`updateAuthor find updated data`);
      res.data = convertAuthorToResult(data[0]);
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(
        `updateAuthor updated data count is unexpected(${data.length})`
      );
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 著者データ追加
 * @param author 著者データ
 * @returns 著者データ更新結果
 */
export const insertAuthor = async (
  author: AuthorsInsert
): Promise<ResultGetAuthor> => {
  let res: ResultGetAuthor = {
    result: ResultSupabase.Error,
    data: null,
  };
  const { data, error } = await supabase
    .from("authors")
    .insert({
      authorId: author.authorId,
      name: author.name,
    })
    .select(
      `
        authorId, 
        name,
        books (
          isbn,
          name,
          publishedAt,
          authorId,
          publisherId,
          publishers (
            publisherId,
            name
          )
        )`
    );

  console.log(
    `updateAuthor data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateAuthor exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`updateAuthor updated data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`updateAuthor inserted data count is zero`);
      res.result = ResultSupabase.Error;
      return res;

    case 1:
      console.log(`updateAuthor find inserted data`);
      res.data = convertAuthorToResult(data[0]);
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(
        `updateAuthor inserted data count is unexpected(${data.length})`
      );
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 著者データ削除
 * @param authorId 著者ID
 * @returns 著者データ削除結果
 */
export const deleteAuthor = async (
  authorId: number
): Promise<ResultSupabase> => {
  const { error } = await supabase
    .from("authors")
    .delete()
    .eq("authorId", authorId);
  console.log(`deleteAuthor error=${JSON.stringify(error)}`);

  if (error) {
    console.log(`deleteAuthor exists error`);
    return ResultSupabase.Error;
  }

  return ResultSupabase.Success;
};

const convertPublisherToResult = (
  src: PublishersRowWithBooksRow
): PublishersRowResult => {
  let dst: PublishersRowResult;
  dst = {
    publisherId: src.publisherId,
    name: src.name,
    books: [],
    relatedAuthors: [],
  };
  for (const books of src.books) {
    dst.books.push({
      isbn: books.isbn,
      name: books.name,
      publishedAt: books.publishedAt,
      authorId: books.authorId,
      publisherId: books.publisherId,
    });
    if (books.authors) {
      if (
        !dst.relatedAuthors.find(
          (element) => element.authorId === books.authorId
        )
      ) {
        dst.relatedAuthors.push(books.authors);
      }
    }
  }
  return dst;
};

/**
 * 出版社データ取得
 * @param publisherId 出版社ID
 * @returns 出版社データ取得結果
 */
export const getPublisher = async (
  publisherId: number
): Promise<ResultGetPublisher> => {
  let res: ResultGetPublisher = {
    result: ResultSupabase.Error,
    data: null,
  };

  const { data, error } = await supabase
    .from("publishers")
    .select(
      `
        publisherId,
        name,
        books (
          isbn,
          name,
          publishedAt,
          authorId,
          publisherId,
          authors (
            authorId,
            name
          )
        )
      `
    )
    .filter("publisherId", "eq", publisherId);

  console.log(
    `getPublisher data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`getPublisher exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`getPublisher data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`getPublisher data count is zero`);
      res.result = ResultSupabase.Nothing;
      return res;

    case 1:
      console.log(`getPublisher find data`);
      res.data = convertPublisherToResult(data[0]);
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(`getPublisher data count is unexpected(${data.length})`);
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 出版社データ更新
 * @param publisherId 出版社ID
 * @param publisher 出版社データ
 * @returns 出版社データ更新結果
 */
export const updatePublisher = async (
  publisherId: number,
  publisher: PublishersUpdate
): Promise<ResultGetPublisher> => {
  let res: ResultGetPublisher = {
    result: ResultSupabase.Error,
    data: null,
  };
  const { data, error } = await supabase
    .from("publishers")
    .update({
      publisherId: publisher.publisherId,
      name: publisher.name,
    })
    .eq("publisherId", publisherId)
    .select(
      `
        publisherId,
        name,
        books (
          isbn,
          name,
          publishedAt,
          authorId,
          publisherId,
          authors (
            authorId,
            name
          )
        )
      `
    );

  console.log(
    `updatePublisher data=${JSON.stringify(data)}, error=${JSON.stringify(
      error
    )}`
  );

  if (error) {
    console.log(`updatePublisher exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`updatePublisher updated data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`updatePublisher updated data count is zero`);
      res.result = ResultSupabase.Nothing;
      return res;

    case 1:
      console.log(`updatePublisher find updated data`);
      res.data = convertPublisherToResult(data[0]);
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(
        `updatePublisher updated data count is unexpected(${data.length})`
      );
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 出版社データ更新
 * @param publisher 出版社データ
 * @returns 出版社データ更新結果
 */
export const insertPublisher = async (
  publisher: PublishersInsert
): Promise<ResultGetPublisher> => {
  let res: ResultGetPublisher = {
    result: ResultSupabase.Error,
    data: null,
  };
  const { data, error } = await supabase
    .from("publishers")
    .insert({
      publisherId: publisher.publisherId,
      name: publisher.name,
    })
    .select(
      `
        publisherId,
        name,
        books (
          isbn,
          name,
          publishedAt,
          authorId,
          publisherId,
          authors (
            authorId,
            name
          )
        )
      `
    );

  console.log(
    `updatePublisher data=${JSON.stringify(data)}, error=${JSON.stringify(
      error
    )}`
  );

  if (error) {
    console.log(`updatePublisher exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data) {
    console.log(`updatePublisher inserted data is null`);
    res.result = ResultSupabase.Error;
    return res;
  }

  switch (data.length) {
    case 0:
      console.log(`updatePublisher inserted data count is zero`);
      res.result = ResultSupabase.Error;
      return res;

    case 1:
      console.log(`updatePublisher find inserted data`);
      res.data = convertPublisherToResult(data[0]);
      res.result = ResultSupabase.Success;
      return res;

    default:
      console.log(
        `updatePublisher inserted data count is unexpected(${data.length})`
      );
      res.result = ResultSupabase.Error;
      return res;
  }
};

/**
 * 出版社データ削除
 * @param publisherId 出版社ID
 * @returns 出版社データ削除結果
 */
export const deletePublisher = async (
  publisherId: number
): Promise<ResultSupabase> => {
  const { error } = await supabase
    .from("publishers")
    .delete()
    .eq("publisherId", publisherId);
  console.log(`deletePublisher error=${JSON.stringify(error)}`);

  if (error) {
    console.log(`deletePublisher exists error`);
    return ResultSupabase.Error;
  }

  return ResultSupabase.Success;
};

/**
 * サインアップ
 * @param email メールアドレス
 * @param password パスワード
 * @returns 処理結果
 */
export const signUp = async (
  email: string,
  password: string
): Promise<ResultGetUser> => {
  let res: ResultGetUser = {
    result: ResultSupabase.Error,
    data: null,
  };

  const supabaseAuth = createServerComponentClient({ cookies });

  //サインアップ
  const { data, error } = await supabaseAuth.auth.signUp({ email, password });
  console.log(
    `signUp data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`signUp exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (data && data.user) {
    if (data.user.identities?.length === 0) {
      console.log("signUp already used email");
      res.result = ResultSupabase.Error;
      return res;
    }
  }

  if (!data || !data.user || !data.user.email) {
    console.log("signUp invalid data");
    res.result = ResultSupabase.Error;
    return res;
  }

  console.log("signUp success");
  res.data = { email: data.user.email, id: data.user.id };
  res.result = ResultSupabase.Success;
  return res;
};

/**
 * サインイン
 * @param email メールアドレス
 * @param password パスワード
 * @returns 処理結果
 */
export const signIn = async (
  email: string,
  password: string
): Promise<ResultGetUser> => {
  let res: ResultGetUser = {
    result: ResultSupabase.Error,
    data: null,
  };

  const supabaseAuth = createServerComponentClient({ cookies });

  //サインイン
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });
  console.log(
    `signIn data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`signIn exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (!data || !data.user || !data.user.email) {
    console.log("signIn invalid data");
    res.result = ResultSupabase.Error;
    return res;
  }

  console.log("signIn success");
  res.data = { email: data.user.email, id: data.user.id };
  res.result = ResultSupabase.Success;
  return res;
};

/**
 * サインアウト
 * @returns 処理結果
 */
export const signOut = async (): Promise<ResultSupabase> => {
  const supabaseAuth = createServerComponentClient({ cookies });

  //サインアウト
  const { error } = await supabaseAuth.auth.signOut();
  console.log(`signOut error=${JSON.stringify(error)}`);

  if (error) {
    console.log(`signOut exists error`);
    return ResultSupabase.Error;
  }

  console.log("signOut success");
  return ResultSupabase.Success;
};

/**
 * サインイン中のユーザーのパスワード変更
 * @param password パスワード
 * @returns 処理結果
 */
export const updatePassword = async (
  password: string
): Promise<ResultGetUser> => {
  let res: ResultGetUser = {
    result: ResultSupabase.Error,
    data: null,
  };

  const supabaseAuth = createServerComponentClient({ cookies });

  //パスワード更新
  const {
    data: { user },
    error,
  } = await supabaseAuth.auth.updateUser({ password: password });

  console.log(
    `getUser user=${JSON.stringify(user)}, error=${JSON.stringify(error)}`
  );

  if (!user || !user.email) {
    console.log("getUser invalid user");
    res.result = ResultSupabase.Error;
    return res;
  }

  console.log("getUser success");
  res.data = { email: user.email, id: user.id };
  res.result = ResultSupabase.Success;
  return res;
};

/**
 * サインイン中のユーザー情報取得
 * @returns 処理結果
 */
export const getUser = async (): Promise<ResultGetUser> => {
  let res: ResultGetUser = {
    result: ResultSupabase.Error,
    data: null,
  };

  //セッションからユーザー情報取得
  const supabaseAuth = createServerComponentClient({ cookies });
  const { data, error } = await supabaseAuth.auth.getSession();
  console.log(
    `getUser getSession data=${JSON.stringify(data)}, error=${JSON.stringify(
      error
    )}`
  );

  if (error) {
    console.log(`getUser getSession exists error`);
    res.result = ResultSupabase.Error;
    return res;
  }

  if (
    !data ||
    !data.session ||
    !data.session.user ||
    !data.session.user.email
  ) {
    console.log("getUser getSession invalid data");
    res.result = ResultSupabase.Error;
    return res;
  }

  console.log("getUser success");
  res.data = { email: data.session.user.email, id: data.session.user.id };
  res.result = ResultSupabase.Success;
  return res;
};

/**
 * サインイン中のユーザー情報削除
 * @returns 処理結果
 */
export const deleteUser = async (): Promise<ResultSupabase> => {
  //セッションからユーザーID取得
  let id: string;
  {
    const supabaseAuth = createServerComponentClient({ cookies });
    const { data, error } = await supabaseAuth.auth.getSession();
    console.log(
      `deleteUser getSession data=${JSON.stringify(
        data
      )}, error=${JSON.stringify(error)}`
    );

    if (error) {
      console.log(`deleteUser getSession exists error`);
      return ResultSupabase.Error;
    }

    if (!data || !data.session || !data.session.user || !data.session.user.id) {
      console.log("deleteUser getSession invalid data");
      return ResultSupabase.Error;
    }

    id = data.session.user.id;
  }

  //ユーザー削除
  {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.admin.deleteUser(id);
    console.log(
      `deleteUser deleteUser user=${JSON.stringify(
        user
      )}, error=${JSON.stringify(error)}`
    );

    if (error) {
      console.log(`deleteUser deleteUser exists error`);
      return ResultSupabase.Error;
    }

    console.log("deleteUser success");
    return ResultSupabase.Success;
  }
};
