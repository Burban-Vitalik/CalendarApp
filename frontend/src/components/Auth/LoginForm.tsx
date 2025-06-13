/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/react'

const formContainerStyles = css`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

const titleStyles = css`
  text-align: center;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`

const formGroupStyles = css`
  margin-bottom: 1rem;
`

const labelStyles = css`
  display: block;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

const inputStyles = css`
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const buttonStyles = css`
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`

const errorStyles = css`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

const forgotPasswordStyles = css`
  display: block;
  text-align: right;
  color: #3b82f6;
  font-size: 0.875rem;
  text-decoration: none;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('Login attempt with:', { email, password })
    } catch (err) {
      setError('Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div css={formContainerStyles}>
      <h2 css={titleStyles}>Welcome Back</h2>
      
      <form onSubmit={handleSubmit}>
        <div css={formGroupStyles}>
          <label css={labelStyles} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            css={inputStyles}
            placeholder="Enter your email"
            required
          />
        </div>

        <div css={formGroupStyles}>
          <label css={labelStyles} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            css={inputStyles}
            placeholder="Enter your password"
            required
          />
          <a href="#" css={forgotPasswordStyles}>
            Forgot Password?
          </a>
        </div>

        {error && <div css={errorStyles}>{error}</div>}

        <button 
          type="submit" 
          css={buttonStyles}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm 