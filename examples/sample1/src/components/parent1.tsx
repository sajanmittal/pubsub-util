import React from 'react'
import Child1 from './child1';
import { usePubSub } from '../lib/usePubSub';

export default function Par1(props: any){

 usePubSub((subs)=>{
    subs.subscribe('parent1',(args)=>{
        console.log('parent1 clicked');
    })
  });

    return (
        <div>
            <h1>Parent1</h1>
            <Child1 />
        </div>
    )
}