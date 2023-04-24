import React from 'react';
import logo from '../images/sushi.png'

//NavBar Component
function Navbar(){
    return (
        
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">
                <img src={logo} className="size_sm me-2" alt="sushi" />
                    Sushi Project

                </span>

                <div>
                </div>
            </div>
        </nav>
        
        )
    }

export default Navbar;