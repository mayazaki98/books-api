import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabaseSchema";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
): Promise<ResultSupabase> => {
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
    .select();

  console.log(
    `updateBook data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateBook exists error`);
    return ResultSupabase.Error;
  }

  if (!data) {
    console.log(`updateBook updated data is null`);
    return ResultSupabase.Error;
  }

  switch (data.length) {
    case 0:
      console.log(`updateBook updated data count is zero`);
      return ResultSupabase.Nothing;

    case 1:
      console.log(`updateBook find updated data`);
      return ResultSupabase.Success;

    default:
      console.log(
        `updateBook updated data count is unexpected(${data.length})`
      );
      return ResultSupabase.Error;
  }
};

/**
 * 書籍データ追加
 * @param book 書籍データ
 * @returns 書籍データ追加結果
 */
export const insertBook = async (
  book: BooksInsert
): Promise<ResultSupabase> => {
  const { data, error } = await supabase
    .from("books")
    .insert({
      isbn: book.isbn,
      name: book.name,
      authorId: book.authorId,
      publisherId: book.publisherId,
      publishedAt: book.publishedAt,
    })
    .select();

  console.log(
    `updateBook data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateBook exists error`);
    return ResultSupabase.Error;
  }

  if (!data) {
    console.log(`updateBook inserted data is null`);
    return ResultSupabase.Error;
  }

  switch (data.length) {
    case 0:
      console.log(`updateBook inserted data count is zero`);
      return ResultSupabase.Error;

    case 1:
      console.log(`updateBook find inserted data`);
      return ResultSupabase.Success;

    default:
      console.log(
        `updateBook inserted data count is unexpected(${data.length})`
      );
      return ResultSupabase.Error;
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
      const d = data[0];
      res.data = {
        authorId: d.authorId,
        name: d.name,
        books: [],
        relatedPublishers: [],
      };
      for (const books of d.books) {
        res.data.books.push({
          isbn: books.isbn,
          name: books.name,
          publishedAt: books.publishedAt,
          authorId: books.authorId,
          publisherId: books.publisherId,
        });
        if (books.publishers) {
          res.data.relatedPublishers.push({
            publisherId: books.publishers.publisherId,
            name: books.publishers.name,
          });
        }
      }
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
): Promise<ResultSupabase> => {
  const { data, error } = await supabase
    .from("authors")
    .update({
      authorId: author.authorId,
      name: author.name,
    })
    .eq("authorId", authorId)
    .select();

  console.log(
    `updateAuthor data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateAuthor exists error`);
    return ResultSupabase.Error;
  }

  if (!data) {
    console.log(`updateAuthor updated data is null`);
    return ResultSupabase.Error;
  }

  switch (data.length) {
    case 0:
      console.log(`updateAuthor updated data count is zero`);
      return ResultSupabase.Nothing;

    case 1:
      console.log(`updateAuthor find updated data`);
      return ResultSupabase.Success;

    default:
      console.log(
        `updateAuthor updated data count is unexpected(${data.length})`
      );
      return ResultSupabase.Error;
  }
};

/**
 * 著者データ追加
 * @param author 著者データ
 * @returns 著者データ更新結果
 */
export const insertAuthor = async (
  author: AuthorsInsert
): Promise<ResultSupabase> => {
  const { data, error } = await supabase
    .from("authors")
    .insert({
      authorId: author.authorId,
      name: author.name,
    })
    .select();

  console.log(
    `updateAuthor data=${JSON.stringify(data)}, error=${JSON.stringify(error)}`
  );

  if (error) {
    console.log(`updateAuthor exists error`);
    return ResultSupabase.Error;
  }

  if (!data) {
    console.log(`updateAuthor updated data is null`);
    return ResultSupabase.Error;
  }

  switch (data.length) {
    case 0:
      console.log(`updateAuthor inserted data count is zero`);
      return ResultSupabase.Error;

    case 1:
      console.log(`updateAuthor find inserted data`);
      return ResultSupabase.Success;

    default:
      console.log(
        `updateAuthor inserted data count is unexpected(${data.length})`
      );
      return ResultSupabase.Error;
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
      const d = data[0];
      res.data = {
        publisherId: d.publisherId,
        name: d.name,
        books: [],
        relatedAuthors: [],
      };
      for (const books of d.books) {
        res.data.books.push({
          isbn: books.isbn,
          name: books.name,
          publishedAt: books.publishedAt,
          authorId: books.authorId,
          publisherId: books.publisherId,
        });
        if (books.authors) {
          res.data.relatedAuthors.push({
            authorId: books.authors.authorId,
            name: books.authors.name,
          });
        }
      }
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
): Promise<ResultSupabase> => {
  const { data, error } = await supabase
    .from("publishers")
    .update({
      publisherId: publisher.publisherId,
      name: publisher.name,
    })
    .eq("publisherId", publisherId)
    .select();

  console.log(
    `updatePublisher data=${JSON.stringify(data)}, error=${JSON.stringify(
      error
    )}`
  );

  if (error) {
    console.log(`updatePublisher exists error`);
    return ResultSupabase.Error;
  }

  if (!data) {
    console.log(`updatePublisher updated data is null`);
    return ResultSupabase.Error;
  }

  switch (data.length) {
    case 0:
      console.log(`updatePublisher updated data count is zero`);
      return ResultSupabase.Nothing;

    case 1:
      console.log(`updatePublisher find updated data`);
      return ResultSupabase.Success;

    default:
      console.log(
        `updatePublisher updated data count is unexpected(${data.length})`
      );
      return ResultSupabase.Error;
  }
};

/**
 * 出版社データ更新
 * @param publisher 出版社データ
 * @returns 出版社データ更新結果
 */
export const insertPublisher = async (
  publisher: PublishersInsert
): Promise<ResultSupabase> => {
  const { data, error } = await supabase
    .from("publishers")
    .insert({
      publisherId: publisher.publisherId,
      name: publisher.name,
    })
    .select();

  console.log(
    `updatePublisher data=${JSON.stringify(data)}, error=${JSON.stringify(
      error
    )}`
  );

  if (error) {
    console.log(`updatePublisher exists error`);
    return ResultSupabase.Error;
  }

  if (!data) {
    console.log(`updatePublisher inserted data is null`);
    return ResultSupabase.Error;
  }

  switch (data.length) {
    case 0:
      console.log(`updatePublisher inserted data count is zero`);
      return ResultSupabase.Error;

    case 1:
      console.log(`updatePublisher find inserted data`);
      return ResultSupabase.Success;

    default:
      console.log(
        `updatePublisher inserted data count is unexpected(${data.length})`
      );
      return ResultSupabase.Error;
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
