import React from 'react'
// import { Link } from 'react-router-dom'
const Navbar = () => {
  // const user = null
  return (
    <div>
      <div class='navbar card-header d-flex w-100 justify-content-between'>
        <h1>Depression Detection</h1>
        {/* <div class='form-inline'>
          {user ? (
            <div class='navbar-inline'>
              <h1 class='navbar-brand'>{user}</h1>
              <button
                class='btn btn-outline-success my-2 my-sm-0'
                style={{ marginRight: '10px', backgroundColor: 'black' }}
                type='submit'
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              component={Link}
              to='/auth'
              class='btn btn-secondary my-2 my-sm-0'
              type='submit'
            >
              Log In
            </button>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default Navbar
