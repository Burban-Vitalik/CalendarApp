/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const containerStyles = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f1f5f9;
`

const toggleButtonStyles = css`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
  
  &:hover {
    color: #2563eb;
  }
`

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div css={containerStyles}>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <button 
        css={toggleButtonStyles}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>
    </div>
  )
}

export default AuthContainer 