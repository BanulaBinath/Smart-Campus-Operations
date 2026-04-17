import React from 'react'
import { Link } from 'react-router-dom'

function home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login"><button>Login</button></Link>
      
    
    </div>
  )
}

export default home
