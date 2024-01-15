import React from 'react';
import './NewCollections.css';
import Item from '../Items/Item';
import { useState } from 'react';
import { useEffect } from 'react';

const NewCollections = () => {

  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch('https://shopping-e-commerce-app.onrender.com/newcollections')
    .then((response) => response.json())
    .then((data) => setNew_Collection(data));
  }, [])

  return (
    <div className='newcollections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price= {item.old_price} />
        })}
      </div>
    </div>
  )
}

export default NewCollections
