import React, { useState, useEffect } from 'react'
import { queryRoute } from '../../Routes/AllRoute';


export default function Chat() {
    const [message, setMessage] = useState("");
    const [chats, setchats] = useState([]);
    const [isTyping, setisTyping] = useState(false);

    const chat = async (e, message) => {
        e.preventDefault();

        if (!message) return;
        setisTyping(true);

        let msgs = chats;
        msgs.push({ role: "user", content: message });
        setchats(msgs);

        setMessage("");
        fetch(queryRoute, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body:  JSON.stringify({
                chats
            }),
        }).then((res) => res.json())
           .then((data) =>{
             msgs.push(data.output)
             setchats(msgs);
             setisTyping(false)
           }).catch((err) => console.log(err))
    }

    return (
        <div>
            <main>
                <h1>TalentIQ ChatBot</h1>
                <section>
                    {chats && chats.length
                        ? chats.map((chat, index) => (
                            <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                                <span>
                                    <b>{chat.role.toUpperCase()}</b>
                                </span>
                                <span>:</span>
                                <span>{chat.content}</span>
                            </p>
                        ))
                        : ""}

                </section>

                <div className={isTyping ? "" : "hide"}>
                    <p>
                        <i>{isTyping ? "Typing" : ""}</i>
                    </p>

                </div>

                <form action="" onSubmit={(e) => chat(e,message)}>
                    <input 
                    type="text"
                    name="message"
                    value={message}
                    placeholder="Type a message here and hit Enter..."
                    onChange={(e)=> setMessage(e.target.value)}
                    />

                </form>
            </main>

        </div>
    );
}
