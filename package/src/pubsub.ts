import { Subject, Subscription } from 'rxjs';

/**
 *  Repersents a disposable resource to handle multiple subscriptions with respect to a unique event.
 * 
 * Each subscription is independent to each other. 
 * Different subscriptions may belong to the same or different componant instance obesreving to the same event.
 * 
 * @template T event arguments of type `T`
 * @class CustomObserable<T>
 * @private
 */
class CustomObserable<T> {
    /**
     * Unique event mllticast observable of type {@link Subject<T>}.
     * 
     * @readonly
     * @property {event}
     */
    readonly event: Subject<T | undefined> = new Subject<T | undefined>();

    /**
     * Subscriptions mapping with repect to each component instance.{@link Map}
     * 
     *
     * @readonly
     * @property {subscriptions} 
     */
    readonly subscriptions: Map<string, Subscription[]> = new Map<string, Subscription[]>();
    
    /**
     * Publishes the 
     */
    async publish<U extends T>(message?: U): Promise<boolean> {
        try{
            this.event.next(message);
            return true;
        }
        catch(error){
            throw error;
        }
    }

    async subscribe<U extends T>(instanceId: string, func: (message?: U) => void, defaultMessage?: U): Promise<boolean> {
        try{
            const subscription = this.event.subscribe((message?: T) => {
                func({...defaultMessage, ...message} as U | undefined);
            })
            if(subscription) {

                const subscriptionsArr = this.subscriptions.get(instanceId);
                
                if(subscriptionsArr) {
                    subscriptionsArr.push(subscription);
                }else{
                    this.subscriptions.set(instanceId, [subscription]);
                }
                return true;    
            }    
        }
        catch(error){
            throw error;
        }
        
        return false;
    }

    async unsubscribe(instanceId: string): Promise<boolean>  {
        try{
            const subscriptionsArr = this.subscriptions.get(instanceId)
            if(subscriptionsArr){
                subscriptionsArr.forEach((sub)=>{
                    sub.unsubscribe();
                })
                this.subscriptions.delete(instanceId);
            }
             return true;
            }catch(error){
                throw error;
        }
    }
}

/**
 * 
 * @private
 * @method
 * @param prefix @type {string}
 * @returns generated Id @type {string}
 */
function generateId(prefix: string): string {
    let suffix: string = Math.random().toString(36);
    return prefix.concat('_', suffix.substr(2,suffix.length));
}

/**
 * @public
 * @interface
 */
export interface EventArgs {
    value?: any
    sender?: object
}

export interface IPublisher<T extends EventArgs> {
    publish(events: string | string[], args?: T): Promise<boolean>;
}

export interface ISubscriber<T extends EventArgs>{
    readonly instanceId: string;
    readonly subsscribedEvents: Set<string>;
    subscribe(event: string, action:(args?: T)=> void, staticArgs?: T): Promise<boolean>;
}

const eventMapper: Map<string, CustomObserable<EventArgs>> = new Map<string, CustomObserable<EventArgs>>();

class Subscriber<T extends EventArgs> implements ISubscriber<T> {

    constructor(prefix: string){
        this.instanceId = generateId(prefix);
        this.subsscribedEvents = new Set<string>();
    }

    readonly instanceId: string;
    readonly subsscribedEvents: Set<string>;

    async subscribe(event: string, action: (args?: T) => void, staticArgs?: T): Promise<boolean> {
        try{
        
            if(!eventMapper.has(event)){
                eventMapper.set(event, new CustomObserable<EventArgs>());
            }

            const observable = eventMapper.get(event);

            if(observable){
               const isSubscribed = await observable.subscribe(this.instanceId, action, staticArgs);
                if(isSubscribed) {
                    this.subsscribedEvents.add(event);
                        
                console.info('event', event, 'subscribed');
                }
            }
        return true;
        }catch(error){
             console.error('Subscriber Error: while subscribing for event',event,'error', error);
             throw error;
        }
    }
}

export const publisher: IPublisher<EventArgs> = {

        async publish(events: string | string[], message?: EventArgs): Promise<boolean> {
        const publishers : string[] = typeof events === 'string' ? [events] : events;
        try{
            publishers.forEach( t =>{
                const observable = eventMapper.get(t);
 
                if(observable){
                    observable.publish(message)
                    .then(b => {if(b) console.info('event', t, 'published')})
                    .catch(error => { console.error('event', t, 'error', error) })
                }else{             
                    console.warn('event', t,' does not exist!!');
                }
            });
            return true;
        }catch(error){
            console.error('Publisher Error: while publishing for ',publishers.length === 1 ? 'event '.concat(publishers[0]) : 'events '.concat(publishers.join(',')),'error', error);
            throw error;
        }
    } 
} 

export const initialize = <T extends EventArgs>(subscribeHandler?: (subscriber: ISubscriber<T>)=>void, prefix: string = 'instance') : ISubscriber<T> => {
        
    const subscriber = new Subscriber<T>(prefix);
        subscribeHandler?.call(subscriber, subscriber);
        return subscriber;
}

export const destroy = <T extends EventArgs>(subscriber: ISubscriber<T>) => {
        subscriber.subsscribedEvents.forEach((event, index, arr) => {
                const observable = eventMapper.get(event);
                if(observable){
                    observable.unsubscribe(subscriber.instanceId);
                }
                arr.delete(event);
                console.log(event, 'unsubscribed');
            });
}

export const dispose = () => {
    eventMapper.forEach((value, key, map) =>{
        if(value.subscriptions.size === 0){
            map.delete(key);
            console.log(key, 'cleared');
        }
    })
}
