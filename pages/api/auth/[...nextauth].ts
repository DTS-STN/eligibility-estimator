import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const user = { id: '1', name: 'Estimator User' }
        const { username, password } = credentials as {
          username: string
          password: string
        }

        if (
          username !== process.env.NEXT_AUTH_USERNAME ||
          password !== process.env.NEXT_AUTH_PASSWORD
        ) {
          return null
        }

        return user
      },
    }),
  ],
}

export default NextAuth(authOptions)
