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
    {id:0 , name: 'California', prezzo:2.50 ,img: california , quantita:0 },
    {id:1 , name: 'Dragon', prezzo:4.20 ,img: dragon , quantita:0 },
    {id:2 , name: 'Dynamite', prezzo:2.10 ,img: dynamite , quantita:0 },
    {id:3 , name: 'Whitey', prezzo:1.50 ,img: whitey , quantita:0 },
    {id:4 , name: 'Rainbow', prezzo:3.40 ,img: rainbow , quantita:0 },
    {id:5 , name: 'Fungi', prezzo:2.80 ,img: fungi , quantita:0 },
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
   <div className='bg_cstm'>
      <Navbar />
      <div className="container min-vh-100">
        <div className="d-flex justify-content-center align-items-center">
          <h1 className='text-center text-white me-5'>Cosa desideri ordinare?</h1>
          <Cart key={cards.id} items={cards} />
        </div>
      
        <hr className='text-white'/>
        <div className="row">
          {cards.map(card =>(
          <Card key={card.id} card ={card} onDecrement={handleDecrement} onIncrement={handleIncrement}/>
          ))}

        </div>
      </div>
      <Footer />
   </div>

   </>
  );
}

export default App;
