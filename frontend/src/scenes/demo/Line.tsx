import React, { useRef, useEffect } from "react";
import { LinePropsType } from "../../shared/types";

const ScrollableConsoleLine = (props: LinePropsType) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const stream = props.websocketStream;
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setInput(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const inputText = props.inputText;
            props.setOutput(`${props.outputText} \n${inputText} \n${inputText} was sent`);
            props.setInput('');
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            inputRef.current.value = '';
        }
    }, [props.outputText]);

    return (
        <div className="h-full" onClick={() => inputRef.current?.focus()}>
            <div className="mx-5 my-5 h-full" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <pre className="h-auto">{props.outputText}</pre>
                <input id="terminalInput" className='bg-secondary-600 rounded w-full focus:outline-none animate-blink' onChange={handleInputChange} onKeyUp={handleKeyPress} ref={inputRef} />
            </div>
        </div>
    );
}

export default ScrollableConsoleLine;