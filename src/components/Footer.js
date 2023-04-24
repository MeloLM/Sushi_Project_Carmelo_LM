import React from 'react';

function Footer() {
    return (
    <>
    
    <footer className="bg-dark text-white text-center mt-4">
    <div className="container p-4">

    
        <section className="">
        <form action="">

            <div className="row d-flex justify-content-center">

            <div className="col-auto">
                <p className="pt-2">
                <strong>Write feed for our website</strong>
                </p>
            </div>

            <div className="col-md-5 col-12">
                <div className="form-outline">
                <input type="email" id="form5Example2" className="form-control" />
                </div>
            </div>

            <div className="col-auto">

                <button type="submit" className="btn btn-primary">
                Send 
                </button>

            </div>
            </div>

        </form>
        </section>

    </div>
    
    <div className="text-center p-4">
        <span>© Copyright by: </span>
        <a className="text-white" href="https://github.com/MeloLM">carmelo.la.mantia00@gmail.com</a>
    </div>
    
    </footer>
  
    </>
    )
}

export default Footer;