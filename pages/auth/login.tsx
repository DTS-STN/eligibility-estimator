import type { NextPage } from 'next'
import { FormEventHandler, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Layout } from '../../components/Layout'

const Login: NextPage<{ password: string; nextURL: string }> = ({
  password,
  nextURL,
}) => {
  //
  const [userInfo, setUserInfo] = useState({ username: '', password: '' })

  const session = useSession()
  console.log('login session', session)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    await signIn('credentials', {
      username: userInfo.username,
      password: userInfo.password,
      redirect: false,
    })
      .then((response) => console.log('res', response))
      .catch((error) => console.log('error', error))
  }

  return (
    <>
      <Layout title={'login'}>
        <div className="my-8 w-1/2 mx-auto">
          <form onSubmit={handleSubmit}>
            <h2 className="h2">Login</h2>

            <label
              htmlFor="username"
              style={{
                display: 'inline-block',
                padding: '4px 20px',
                margin: '6px 0',
                color: 'black',
              }}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              style={{
                display: 'inline-block',
                border: '1px solid #ccc',
                padding: '8px 20px',
                width: '100%',
                margin: '8px 0',
              }}
              placeholder="jennifer"
              onChange={({ target }) => {
                setUserInfo({ ...userInfo, username: target.value })
              }}
            />

            <label
              htmlFor="password"
              style={{
                display: 'inline-block',
                padding: '4px 20px',
                margin: '6px 0',
                color: 'black',
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              style={{
                display: 'inline-block',
                border: '1px solid #ccc',
                padding: '8px 20px',
                width: '100%',
                margin: '8px 0',
              }}
              placeholder="*********"
              onChange={({ target }) => {
                setUserInfo({ ...userInfo, password: target.value })
              }}
            />

            <input
              type="submit"
              style={{
                background: '#04AA6D',
                color: 'white',
                padding: '14px 20px',
                margin: '8px 0',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
              value="Login"
            />
          </form>
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  return {
    props: {
      password: process.env.PASSWORD,
      nextURL: process.env.NEXTAUTH_URL,
    },
  }
}

export default Login
