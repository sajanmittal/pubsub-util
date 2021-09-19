import { useEffect } from "react";
import { EventArgs, IPublisher, ISubscriber, initialize, distroy, publisher  } from "./pubsub";

export function usePubSub<T extends EventArgs>(subscribeHandler?: (subscriber: ISubscriber<T>)=>void, prefix: string = 'instance'): IPublisher<T> {

    useEffect(()=>{
       const subscriber = initialize(subscribeHandler, prefix);

        return ()=>{
            distroy(subscriber);
        }
    // eslint-disable-next-line
    },[]);

    return publisher;
}

export {dispose } from "./pubsub";