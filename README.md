This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, create a .env file with properties: 

 ``` GITHUB_ID=:
  
  GITHUB_SECRET=:
  
  EMAIL_SERVER_USER=:
  
  EMAIL_SERVER_HOST=:
  
  EMAIL_SERVER_PASSWORD=:
  
  EMAIL_SERVER_PORT=:
  
  EMAIL_FROM=:

  MONGODB_UN=:
  
  MONGODB_PASS=:
  
  MONGODB_URL=:

  NEXTAUTH_URL=http://localhost:3000
  ```

- Look up details in [Next-Auth](https://next-auth.js.org/tutorials) and the first link for tutorials

Second, firebase is used to configure to store pictures of posts 

- Go to /utils/lib/firebase/firebase.js and change the firebaseConfig
-- To get credentials please refer to docs [Firebase-Storage](https://firebase.google.com/docs/storage)
-- Also these credntials are no longer working


Second, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


