"use client"
import LoginForm from '@/components/ui/login-ui/LoginForm'
import React, { useEffect } from 'react'

function LoginPage() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }, []);
  return (
    <div><LoginForm/></div>
  )
}

export default LoginPage