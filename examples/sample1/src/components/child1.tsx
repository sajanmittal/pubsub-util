import React from 'react'
import { usePubSub } from '../lib/usePubSub';

export default function Child1(props: any){

      usePubSub((subs)=>{
    subs.subscribe('child1',(args)=>{
     console.log('child1 clicked');
    })
  });

    return (
        <div>
          <h1>Child1</h1>
        </div>
    )
}