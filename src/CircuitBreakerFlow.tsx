import React, {useEffect, useState} from 'react';
import ReactFlow, {Elements} from 'react-flow-renderer';
import './updatenode.css';
import {CircuitBreaker} from "./circuitbreaker/CircuitBreaker";
import {Service} from "./service/Service";


const circuitBreaker: CircuitBreaker = new CircuitBreaker(3000, 1);
const service: Service = new Service(true, true);
const decoratedService = CircuitBreaker.decorate(circuitBreaker, () => service.doSomething());

const circuitBreakerStyles = {
    'OPEN': {
        background: '#f39797',
        color: '#333',
        border: '1px solid #222138',
        width: 180,
    },
    'CLOSED': {
        background: '#c1e5ae',
        color: '#333',
        border: '1px solid #222138',
        width: 180,
    },
    'HALF-OPEN': {
        background: '#d9d383',
        color: '#333',
        border: '1px solid #222138',
        width: 180,
    }
}

function circuitBreakerLabel(circuitBreaker: CircuitBreaker, callCounter: number): React.ReactElement {
    return (
        <>
            <b>Client with Circuit Breaker</b>
            <br/>
            <label>{`Failure Threshold: ${circuitBreaker.failureThreshold}`}</label>
            <br/>
            <label>{`Failure Count: ${circuitBreaker.failureCounter}`}</label>
            <br/>
            <label>{`State: ${circuitBreaker.state}`}</label>
            <br/>
            <label>{`Call Count: ${callCounter}`}</label>
        </>
    );
}

function serviceLabel(service: Service): React.ReactElement {
    return (
        <>
            <b>Service</b>
            <br/>
            <label>{`Functional: ${service.isFunctional}`}</label>
        </>
    );
}

const initialElements: Elements = [
    {
        id: '1',
        data: {
            label: circuitBreakerLabel(circuitBreaker, 0),
            failureThreshold: circuitBreaker.failureThreshold,
            failureCount: circuitBreaker.failureCounter
        },
        position: {x: 100, y: 50},
        style: circuitBreakerStyles[circuitBreaker.state]
    },
    {
        id: '2',
        data: {label: serviceLabel(service)},
        position: {x: 100, y: 200}
    },
    {id: 'e1-2', source: '1', target: '2', animated: true},
];

export default () => {
    const [elements, setElements] = useState<Elements>(initialElements);
    const [isChecked, setIsChecked] = useState<boolean>(service.isFunctional);
    const [callCounter, setCallCounter] = useState<number>(0);

    // Circuit Breaker properties
    const [failureCounter, setFailureCounter] = useState<number>(circuitBreaker.failureCounter);
    const [failureThreshold, setFailureThreshold] = useState<number>(circuitBreaker.failureThreshold);
    const [state, setState] = useState(circuitBreaker.state);

    useEffect(() => {
        const timer = setInterval(() => {
            setCallCounter(callCounter + 1);
            try {
                decoratedService();
            } catch (e) {
                // ignoring error so that the following statements can run
            }
            console.log('Checking if state variables need to be updated', state, failureCounter);
            console.log('Circuit breaker variables', circuitBreaker.state, circuitBreaker.failureCounter);
            if (circuitBreaker.state != state) {
                setState(circuitBreaker.state);
            }
            if (circuitBreaker.failureCounter != failureCounter) {
                setFailureCounter(circuitBreaker.failureCounter);
            }
        }, 1000)
        return () => clearTimeout(timer)
    })

    useEffect(() => {
        service.isFunctional = isChecked
    }, [isChecked]);

    // useEffect(() => {
    //     setElements((els) =>
    //         els.map((el) => {
    //             if (el.id == '1') {
    //                 el.data = {
    //                     ...el.data,
    //                     label: circuitBreakerLabel(circuitBreaker),
    //                     failureThreshold: failureThreshold,
    //                 }
    //             }
    //             if (el.id == '2') {
    //                 el.data = {
    //                     ...el.data,
    //                     label: serviceLabel(service),
    //                 }
    //             }
    //             return el;
    //         })
    //     )
    // }, [failureThreshold, isChecked, setElements]);


    useEffect(() => {
        setElements((els) =>
            els.map((el) => {
                if (el.id == '1') {
                    el.style = circuitBreakerStyles[circuitBreaker.state];
                    el.data = {
                        ...el.data,
                        label: circuitBreakerLabel(circuitBreaker, callCounter),
                        failureCount: failureCounter,
                    }
                }

                if (el.id == '2') {
                    el.data = {
                        ...el.data,
                        label: serviceLabel(service),
                    }
                }

                if (el.id === 'e1-2') {
                    el.isHidden = circuitBreaker.state === 'OPEN' ? true : false;
                }
                return el;
            })
        )
    }, [failureCounter, state, failureThreshold, isChecked, callCounter, setElements]);

    return (
        <ReactFlow elements={elements} defaultZoom={1.5} minZoom={0.2} maxZoom={4} style={{height: 1000}}>
            <div className="updatenode__controls">
                <div>
                    <h3>Circuit Breaker Configuration</h3>
                    <label>Failure Threshold</label>
                    <input type="number" value={failureThreshold}
                           onChange={(evt) => {
                               const failureThreshold = Number(evt.target.value);
                               circuitBreaker.failureThreshold = failureThreshold;
                               setFailureThreshold(failureThreshold);
                           }}/>
                </div>
                <div>
                    <h3>Service Configuration</h3>
                    <label>Functional</label>
                    <input type="checkbox" checked={isChecked}
                           onChange={() => {
                               setIsChecked(!isChecked);
                           }}/>
                </div>
            </div>
        </ReactFlow>
    );
};