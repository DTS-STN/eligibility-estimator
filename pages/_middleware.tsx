import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //
  const AuthRequired = false

  const url = request.nextUrl
  const { pathname } = url

  if (AuthRequired) {
    if (pathname.startsWith(`/api/`)) {
      if (
        !request.headers
          .get('referer')
          ?.includes('estimateursv-oasestimator.service.canada.ca')
      ) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!_next|fonts|examples|svg|[\\w-]+\\.\\w+).*)'],
}
