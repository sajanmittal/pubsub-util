import React from 'react';
import Child2 from './child2';
import { usePubSub } from '../lib/usePubSub';

export default function Par2(props: any){

    usePubSub((subs)=>{
    subs.subscribe('parent2',(args)=>{
        console.log('parent2 clicked');
    })
  });

    return (
        <div>
            <h1>Parent2</h1>
            <Child2 />
        </div>
    )
}