import React from 'react';
import logo from '../images/sushi.png'

//NavBar Component
function Navbar(){
    return (
        
        <nav className="navbar navbar-dark bg-transparent">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1 ">
                    <img src={logo} className="size_sm me-2" alt="sushi" />
                    <p className='d-inline'>Sushi Project</p>

                </span>

                <div className='btn btn-dark pt-2'>
                    <p className='h3 text-white'>Contact</p>
                </div>
            </div>
        </nav>
        
        )
    }

export default Navbar;