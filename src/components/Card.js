import React from 'react';


//Card Component
const Card = (props) => {
    return (
        <div className="col mt-2">
            <div className="card mx-4 p-2" style={{width: '18rem'}}>
                <div className='d-flex justify-content-around align-items-center mb-3'>
                    <button onClick={() => props.onIncrement(props.card)} className="btn btn-success"><i className="bi bi-plus"></i></button>
                    <span className="badge badge-light bg-secondary">{props.card.quantita}</span>
                    <button onClick={() => props.onDecrement(props.card)} className="btn btn-danger"><i className="bi bi-dash"></i></button>
                </div>
                <img src={props.card.img} className="card-img-top" alt="sushi" />
                <div className="card-body">
                    <h5 className="card-title">{props.card.name} Roll</h5>
                    <p className="card-text">€{props.card.prezzo}</p>
                </div>
            </div>
        </div>
        );
    }
    
export default Card;