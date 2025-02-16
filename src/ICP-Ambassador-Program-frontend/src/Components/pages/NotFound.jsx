import React from 'react'

export default function NotFound(){
  return (
    <div className="flex flex-col items-center justify-center h-screen  text-gray-800">
      <h1 className="text-6xl text-gray-100 font-bold">404</h1>
      <p className="text-xl text-gray-100 mt-2">Oops! The page you are looking for does not exist.</p>
      <a
        href="/"
        className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  )
}
