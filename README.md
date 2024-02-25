This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 概要

WEB-API サーバー

https://main.d7trag5vp9gsh.amplifyapp.com/
で公開しています。

- フレームワーク : Next.js
- 言語 : TypeScript
- データベース・認証 : supabase

## API

- authors(著者)

  - POST(作成)
    - エンドポイント
      /api/authors
    - リクエスト
      {authorId:number, name:string}
  - GET(取得)
    - エンドポイント
      /api/authors/[authorId]
  - PUT(更新)
    - エンドポイント
      /api/authors/[authorId]
    - リクエスト
      {authorId:number, name:string}
  - DELETE(削除)
    - エンドポイント
      /api/authors/[authorId]

- publishers(出版社)

  - POST(作成)
    - エンドポイント
      /api/publishers
    - リクエスト
      {publisherId:number, name:string}
  - GET(取得)
    - エンドポイント
      /api/publishers/[publisherId]
  - PUT(更新)
    - エンドポイント
      /api/publishers/[publisherId]
    - リクエスト
      {publisherId:number, name:string}
  - DELETE(削除)
    - エンドポイント
      /api/publishers/[publisherId]

- publishers(出版社)

  - POST(作成)
    - エンドポイント
      /api/publishers
    - リクエスト
      {isbn:string, name: string, publishedAt:string, authorId:number, publisherId:number}
  - GET(取得)
    - エンドポイント
      /api/publishers/[publisherId]
  - PUT(更新)
    - エンドポイント
      /api/publishers/[publisherId]
    - リクエスト
      {isbn:string, name: string, publishedAt:string, authorId:number, publisherId:number}
  - DELETE(削除)
    - エンドポイント
      /api/publishers/[publisherId]

- favorites(お気に入り書籍)

  - POST(作成)
    - エンドポイント
      /api/favorites
    - リクエスト
      {isbn:string}
  - GET(取得)
    - エンドポイント
      /api/favorites
  - PUT(更新)
    - エンドポイント
      /api/favorites
    - リクエスト
      {isbnFrom:string, isbnTo:string}
  - DELETE(削除)
    - エンドポイント
      /api/favorites
    - リクエスト
      {isbn:string}

- auth(認証)
  - POST(サインアップ)
    - エンドポイント
      /api/auth/signup
    - リクエスト
      {email:string, password:string}
  - POST(サインイン)
    - エンドポイント
      /api/auth/signin
    - リクエスト
      {email:string, password:string}
  - POST(サインアウト)
    - エンドポイント
      /api/auth/signout
  - POST(パスワード更新)
    - エンドポイント
      /api/auth/update
    - リクエスト
      {password:string}
  - DELETE(削除)
    - エンドポイント
      /api/auth/delete

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
