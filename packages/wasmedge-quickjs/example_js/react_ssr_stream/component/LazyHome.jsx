import React, { Suspense } from 'react'
import * as LazyPage from './LazyPage.jsx'

async function sleep(ms) {
  return new Promise((r, _) => {
    setTimeout(() => r(), ms)
  })
}

async function loadLazyPage() {
  await sleep(2000)
  return LazyPage
}

class LazyHome extends React.Component {
  render() {
    const LazyPage1 = React.lazy(() => loadLazyPage())
    return (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <title>Title</title>
                </head>
                <body>
                    <div>
                        <div> This is LazyHome </div>
                        <Suspense fallback={<div> loading... </div>}>
                            <LazyPage1 />
                        </Suspense>
                    </div>
                </body>
            </html>
    )
  }
}

export default LazyHome
