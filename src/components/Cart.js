import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Cart(props) {
  const [show, setShow] = useState(false);
  const items = props.items || [];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let totalQuantity = 0;
  let totalPrice = 0;
  
  props.items.forEach((item) => {
    totalQuantity += item.quantita;
    totalPrice += item.prezzo * item.quantita;
  });
  
  // Arrotonda il prezzo totale a 2 decimali
  totalPrice = Math.round(totalPrice * 100) / 100;

  //Aggiungere 5% di sconto ogni 10 pezzi fino max 50% su tot

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Menu
      </Button>

      <Modal show={show} onHide={handleClose}>

        <Modal.Header closeButton>
          <Modal.Title>Il tuo Menu</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <ul>
                {items.map(item => (
                <li>
                    <div key={item.id}>
                        <p>{item.name}  {(item.prezzo*item.quantita).toFixed(2)}€  n. {item.quantita}</p>
                    </div>
                </li>  
                ))}
            </ul>
            <hr />
            <p>Totale pezzi: {totalQuantity}</p>
            <p>Totale: {totalPrice.toFixed(2)}€</p>
            
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Confirm
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}


export default Cart;