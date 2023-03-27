import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      type: 'credentials',
      authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        // validate here your username and password
        if (email !== 'alex@email.com' && password !== 'qqqqq') {
          throw new Error('invalid credentials')
        }
        // confirmed users
        return { id: 1, name: 'Alex', email: 'alex@email.com' }
      },
    }),
  ],
})
