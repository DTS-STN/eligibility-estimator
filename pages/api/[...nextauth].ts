import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const envPassword: string = process.env.PASSWORD

        const user = { id: '1', name: 'Jennifer Lawrence' }
        const { username, password } = credentials as {
          username: string
          password: string
        }

        if (username !== 'jennifer' || password !== envPassword) {
          return user
        } else {
          return user
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
}

export default NextAuth(authOptions)
