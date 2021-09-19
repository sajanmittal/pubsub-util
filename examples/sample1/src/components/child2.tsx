import React from 'react'
import { usePubSub } from '../lib/usePubSub';

export default function Child2(props: any){

    usePubSub((subs)=>{
    subs.subscribe('child2',(args)=>{
      console.log('child2 clicked');
    })
  });

    return (
        <div>
          <h1>Child2</h1>
        </div>
    )
}