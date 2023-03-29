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
        console.log('Auth file:', process.env.NEXTAUTH_URL)
        const user = { id: '1', name: 'Estimator User' }
        const { username, password } = credentials as {
          username: string
          password: string
        }

        if (username !== 'test' || password !== 'test') {
          return null
        }

        return user
      },
    }),
  ],
}

export default NextAuth(authOptions)
