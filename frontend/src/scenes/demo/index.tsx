import Heading from '../../shared/Heading';
import { APICalls, SelectedPage } from '../../shared/types'
import { motion } from 'framer-motion';
import React, { useEffect } from 'react'
import { set, useForm } from 'react-hook-form';
import ScrollableConsoleLine from './Line';
import { encryptForServer, encryptForChannel, decryptFromChannel, getInstance, generateRandomAESKey } from '../../shared/EncryptionUtil';
import { Button, Input, Typography } from '@material-tailwind/react';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
    authenticated?: boolean;
    status?: string;
}

const Demo = ({ setSelectedPage, status = "unspawned" }: Props) => {
    const [authenticated, setAuthenticated] = React.useState(false);
    return (
        <section id='demo' className='mx-auto w-5/6 h-3/5 pb-32 pt-24'>
            <motion.div className='flex flex-col items-center justify-center h-full'
                onViewportEnter={() => setSelectedPage(SelectedPage.Demo)}>
                <motion.div
                    className='w-full h-full items-center'
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
                    {renderContent(authenticated, setAuthenticated)}
                </motion.div>
            </motion.div>
        </section>
    );
}

const authenticate = async (username: string, code: string) => {
    const vmType = 'alpine';
    return fetch(APICalls.RequestSession, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: await encryptForServer(JSON.stringify({ username, code, vmType }))
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.text();
            }
            throw new Error('Something went wrong');
        })
        .then(async (data) => {
            const utf8String = base64ToUtf8(data);
            const decodedData = JSON.parse(utf8String);
            return decodedData;
        })
        .catch((error) => {
            console.error('Error:', error);
            throw error;
        });
}

const renderContent = (authenticated, setAuthenticated) => {
    const { register, handleSubmit } = useForm();
    const [input, setInput] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [failedAuth, setFailedAuth] = React.useState(false);
    let response;
    let websocket;
    const onSubmit = async (data) => {
        const { username, passcode } = data;
        try {
            response = await authenticate(username, passcode);
            if (response) {
                console.log(response);
                websocket = connectWebsocket(response, setOutput);
                setAuthenticated(true);
            }
        } catch (error) {
            console.error('Authentication failed:', error);
            setFailedAuth(true);
        }
    };
    useEffect(() => { }, [failedAuth]);
    useEffect(() => { }, [authenticated]);
    let body;
    if (authenticated) {
        body = (
            <div className='justify-center items-center h-full'>
                <h1 className='basis-3/5 font-montserrat text-2xl font-bold text-accent-400'>Terminal</h1>
                <div className='bg-secondary-400 rounded-lg h-full w-full'>
                    <ScrollableConsoleLine inputText={input} outputText={output} setOutput={setOutput} setInput={setInput} websocketStream={websocket}></ScrollableConsoleLine>
                </div>
            </div>
        );
    } else {
        body = (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4 w-1/3">
                <Input variant='outlined' color='white' error={failedAuth} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} type="text" {...register("username")} className="px-4 py-2 rounded-md" label='Username' placeholder="Enter username" />
                <div>
                    <Input variant='outlined' color='white' error={failedAuth} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} type="text" {...register("passcode")} className="px-4 py-2 rounded-md" label='Passcode' placeholder="Enter passcode" />
                    <Typography
                        variant="small"
                        color="gray"
                        className="mt-2 flex items-center gap-1 font-montserrat text-accent" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="beige"
                            className="-mt-px h-4 w-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Use code provided by me, or contact me for one (Github or Linkedin).
                    </Typography>
                </div>
                <Button type="submit" size="lg" className="ml-2 px-4 py-2 rounded-md bg-tertiary-500 text-accent hover:bg-secondary-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Submit</Button>
            </form>
        );
    }
    return body;
}

const connectWebsocket = (responseData, setOutput) => {
    const websocket = new WebSocket(APICalls.ConnectWebsocket);
    const chanKey = generateRandomAESKey();

    websocket.onopen = async () => {
        console.log('WebSocket connection established');
        const body = JSON.stringify({ init: { args: responseData.args, id: responseData.id, username: responseData.username, chanKey: chanKey } });
        console.log('Sending:', body);
        try {
            websocket.send(await encryptForServer(body));
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    websocket.onmessage = async (event) => {
        const message = event.data;
        const decrypted = await decryptFromChannel(message, chanKey);
        console.log('Message received:', decrypted);
        setOutput(decrypted);
    }
    websocket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        throw error;
    };
    return websocket;
}


function base64ToUtf8(base64: string): string {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8');
    const utf8String = decoder.decode(bytes);

    return utf8String;
}

export default Demo