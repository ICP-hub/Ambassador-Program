import React from 'react'

export default function AccessDenied() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-lg text-gray-700 mb-6">
                    You do not have permission to view this page.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                    Please Login to Access
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-2 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition"
                >
                    Go to Home
                </a>
            </div>
        </div>
    )
}
