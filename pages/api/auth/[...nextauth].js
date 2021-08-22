import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';

import User from '../../../utils/model/User/User.js';
import Client from '../../../utils/lib/mongodb.js';

//auth0 makes all these providers in one with one client secret etc. It is paid though for 700+ members
const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
    Providers.Credentials({
      name: 'Email and Password',
      credentials: {
        username: { label: 'email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        //need validation
        const connectedClient = await Client.connect();
        const db = await Client.db('next-social');
        const userCollection = await db.collection('users');
        const results = await userCollection.findOne({
          email: credentials.username
        });
        if (credentials.password === results?.password) {
          return results;
        }
        return false;
      }
    })
  ],
  adapter: Adapters.TypeORM.Adapter(
    `mongodb+srv://${process.env.MONGODB_UN}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URL}/next-social`,
    {
      models: {
        User: User.User
      }
    }
  ),
  callbacks: {
    async session(session, token) {
      session.user = token;
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt(token, user, profile, isNewUser) {
      //according to docs user,profile, isNewUser are only truthy
      // when you first sign in...
      if (user) {
        token.id = user._id;
      }
      return token;
    }
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60
  }
};

export default async function handler(req, res) {
  await NextAuth(req, res, options);
}
