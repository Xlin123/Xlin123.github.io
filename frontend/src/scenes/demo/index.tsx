import Heading from '../../shared/Heading';
import { SelectedPage } from '../../shared/types'
import { motion } from 'framer-motion';
import React from 'react'
import { set, useForm } from 'react-hook-form';
import ScrollableConsoleLine from './Line';

type Props = {
    setSelectedPage: (value: SelectedPage.Demo) => void;

}

const Demo = ({ setSelectedPage }: Props) => {

    return (
        <section id='demo' className='mx-auto w-5/6 h-3/5 pb-32 pt-24'>
            <motion.div className='flex flex-col items-center justify-center h-full'
                onViewportEnter={() => setSelectedPage(SelectedPage.Demo)}>
                <motion.div
                    className='w-full h-full'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 }
                    }}>
                    {renderTerminal()}
                </motion.div>
            </motion.div>
        </section>
    );
}

const authenticate = (username: string, password: string) => {
    return fetch('http://localhost:8080/session/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

const renderTerminal = () => {

    const [input, setInput] = React.useState('');
    const [output, setOutput] = React.useState('');


    return (
        <div className='justify-center items-center h-full'>
            <div className='bg-secondary-600 rounded-lg h-full w-full'>
                <ScrollableConsoleLine inputText={input} outputText={output} websocketStream={connectWebsocket()} setOutput={setOutput} setInput={setInput}></ScrollableConsoleLine>
            </div>
        </div>
    );
}

const connectWebsocket = () => {
    const websocket = new WebSocket('ws://example.com');

    websocket.onopen = () => {
        console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
        const message = event.data;

    };

    websocket.onclose = () => {

    };

    websocket.onerror = (error) => {

    };
    return websocket;
}

export default Demo