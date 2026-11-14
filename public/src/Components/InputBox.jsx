import '../Styles/InputBox.css';
import React, {useState} from 'react';

const SERVER_URL = `http://localhost:5876`;

export default function InputBox() {

    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    // setInterval(() => {
    //     console.log(`set val to: ${inputValue}`);
    // }, 1000);

    async function handleInput() {
        // Send request to --> /api/:url 
        fetch(`${SERVER_URL}/api/${inputValue}`, {
            method: "POST"
        }).then((response) => {
            if (!response.ok) { // 404, 500, etc. handled
                throw new Error(`error status: ${response.status}`);
            }
            return response.json();
        }).then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <>
            <textarea 
                className="input-box" 
                name="url" 
                value={inputValue}
                onChange={(event) => {
                    setInputValue(event.target.value);
                }}
            /><br />
            <button 
                className="input-button"
                onClick={handleInput}
            >Shorten URL</button>
        </>
    );
}