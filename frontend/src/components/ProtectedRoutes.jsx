import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { useState, useEffect } from 'react'

function ProtectedRoutes({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const response = await api.post("/api/token/refresh/", { refresh: refreshToken });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                setIsAuthorized(true)
            } else {
                console.error('Failed to refresh token:', response.statusText)
                setIsAuthorized(false)
            }
        } catch (error) {
            console.error('Error refreshing token:', error)
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN)
        if (!accessToken) {
            setIsAuthorized(false)
            return
        }
        const decodedToken = jwtDecode(accessToken)
        const tokenExpiration = decodedToken.exp
        const currentTime = Math.floor(Date.now() / 1000)

        if (tokenExpiration < currentTime) {
            // Token expired, try to refresh
            await refreshToken()
        } else {
            // Token is valid
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoutes