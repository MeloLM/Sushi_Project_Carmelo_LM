import React, {useState} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Card from './components/Card';
import Cart from './components/Cart';
import Footer from './components/Footer';

import california from './images/california.png';
import dragon from './images/dragon.png';
import dynamite from './images/dynamite.png';
import whitey from './images/philadelphia.png';
import rainbow from './images/rainbow.png';
import fungi from './images/shrimp.png';

const App = () => {
  const [cards, setCard] = useState([
    {id:0 , name: 'California', prezzo:2.48 ,img: california , quantita:0 },
    {id:1 , name: 'Dragon', prezzo:1.56 ,img: dragon , quantita:0 },
    {id:2 , name: 'Dynamite', prezzo:4.12 ,img: dynamite , quantita:0 },
    {id:3 , name: 'Whitey', prezzo:3.21 ,img: whitey , quantita:0 },
    {id:4 , name: 'Rainbow', prezzo:3.02 ,img: rainbow , quantita:0 },
    {id:5 , name: 'Fungi', prezzo:7.35 ,img: fungi , quantita:0 },
  ]);


  // const handleDelete = cardId =>{
  //   const updateCards = cards.filter(card => card.id !== cardId);
  //   setCard(updateCards);
  // }

  const handleIncrement = card => {
    const newCards = [...cards];
    const id = newCards.indexOf(card);
    newCards[id] = {...card};
    newCards[id].quantita++;
    setCard(newCards);
  }
  const handleDecrement = card => {
    const newCards = [...cards];
    const id = newCards.indexOf(card);
    newCards[id] = {...card};
    newCards[id].quantita--;
    if (newCards[id].quantita >= 0) {  
      setCard(newCards);
    }else {
      newCards[id].quantita = 0;
    }
  }

  return (
   <>
   
    <Navbar />
    <div className="container min-vh-100">
      <div className="d-flex justify-content-center align-items-center">
        <h1 className='text-center me-5'>Cosa desideri ordinare?</h1>
        <Cart key={cards.id} items={cards} />
      </div>
      
      <hr/>
      <div className="row">
        {cards.map(card =>(
        <Card key={card.id} card ={card} onDecrement={handleDecrement} onIncrement={handleIncrement}/>
        ))}

      </div>
    </div>
    <Footer />
   </>
  );
}

export default App;
