import React, { useEffect, useState } from 'react'
import Par1 from './parent1';
import Par2 from './parent2';
import { usePubSub, dispose } from '../lib/usePubSub';

export default function Home(props: any){

    const [parent, setParent] = useState(true);

    const publisher = usePubSub((subs)=>{
    subs.subscribe('home',(args)=>{
        console.log('home clicked');
    })
  });

  useEffect(()=>{
    dispose();
  },[parent]);

  function publish(){
      publisher.publish(['parent2','child2','parent1','child1']) ;
  }

    return (
        <div>
            <div>
            <input type="checkbox" onChange={()=> {setParent((prev)=>!prev)}} checked={parent} />
            <button onClick={publish} >Publish</button>
            </div>
            <br />
            <div>
            {parent ? <Par1 /> : <Par2 />}
            </div>
        </div>
    )
}