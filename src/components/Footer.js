import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Footer({ email = 'carmelo.la.mantia00@gmail.com', githubUrl = 'https://github.com/MeloLM' }) {
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setFeedbackSent(true);
            setInputValue('');
            setTimeout(() => setFeedbackSent(false), 3000);
        }
    };

    return (
        <footer className="text-white text-center" role="contentinfo">
            <div className="container p-4">
                <section>
                    <form onSubmit={handleSubmit} aria-label="Modulo feedback">
                        <div className="row d-flex justify-content-center align-items-center">
                            <div className="col-auto">
                                <p className="pt-2 mb-0">
                                    <strong>
                                        <i className="bi bi-chat-dots me-2"></i>
                                        Lascia un feedback
                                    </strong>
                                </p>
                            </div>

                            <div className="col-md-5 col-12 my-2 my-md-0">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="La tua email..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    aria-label="Inserisci la tua email"
                                    required
                                />
                            </div>

                            <div className="col-auto">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={feedbackSent}
                                >
                                    {feedbackSent ? (
                                        <>
                                            <i className="bi bi-check2 me-1"></i>
                                            Inviato!
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-1"></i>
                                            Invia
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
    
            <div className="text-center p-4" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
                <p className="mb-2">
                    <i className="bi bi-code-slash me-2"></i>
                    Sviluppato con <i className="bi bi-heart-fill text-danger mx-1"></i> da Carmelo La Mantia
                </p>
                <a 
                    className="text-white" 
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visita il profilo GitHub"
                >
                    <i className="bi bi-github me-2"></i>
                    {email}
                </a>
            </div>
        </footer>
    );
}

Footer.propTypes = {
    email: PropTypes.string,
    githubUrl: PropTypes.string
};

export default Footer;