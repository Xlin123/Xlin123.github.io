import Heading from '../../shared/Heading';
import { SelectedPage } from '../../shared/types'
import { motion } from 'framer-motion';
import React, { useEffect } from 'react'
import { set, useForm } from 'react-hook-form';
import ScrollableConsoleLine from './Line';
import { encryptForServer, decryptFromServer, encryptForChannel, decryptFromChannel, getInstance } from '../../shared/EncryptionUtil';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
    authenticated?: boolean;
    status?: string;
}

const Demo = ({ setSelectedPage, authenticated = false, status = "unspawned" }: Props) => {

    useEffect(() => {
        if (authenticated) {
            renderTerminal();
        }
    }, [authenticated]);

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
                    <Heading>
                        Demo
                    </Heading>
                    {renderCodeInput()}
                </motion.div>
            </motion.div>
        </section>
    );
}

const authenticate = async (username: string, code: string) => {
    const vmType = 'alpine';
    return fetch('http://localhost:8080/session/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: await encryptForServer(JSON.stringify({ username, code, vmType }))
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })
        .then(data => {
            return data;
        })
        .catch((error) => {
            console.error('Error:', error);
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

const renderCodeInput = () => {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const { username, passcode } = data;
        let response = await authenticate(username, passcode);
        if (response) {
            renderTerminal();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <input type="text" {...register("username")} className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter username" />
            <input type="text" {...register("passcode")} className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter passcode" />
            <button type="submit" className="ml-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
        </form>
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