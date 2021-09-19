import React from 'react';
import './App.css';
import Home from './components/home';
import { usePubSub } from './lib/usePubSub';

function App() {

  usePubSub((subs)=>{
    subs.subscribe('app',(args)=>{
    })
  });

  return (
    <div className="App">
     <Home />
    </div>
  );
}

export default App;