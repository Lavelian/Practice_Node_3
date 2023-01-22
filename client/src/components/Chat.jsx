import io from "socket.io-client";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";

const socket = { current: io("http://localhost:3001") };

export default function Chat() {
  const [currentUser, setCurrentUser] = useState(() => ({
    name: "",
    id: nanoid(),
  }));
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [arrayUsers, setArrayUsers] = useState([]);

  useEffect(() => {
    socket.current.on("allMassages", (data) => {
      setMessages(data);
    });
    socket.current.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });
  }, []);

  useEffect(() => {
    socket.current.on("newUserName", (data) => {
      setArrayUsers([data, ...arrayUsers]);
    });
    socket.current.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });
  }, [onlineUsers, arrayUsers]);

  useEffect(() => {
    socket.current.on("newMessage", (data) => {
      setMessage([data, ...messages]);
    });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(currentUser);
    socket.current.emit("addUser", currentUser);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    socket.current.emit("sendMessage", {
      autor: currentUser.name,
      text: message,
    });
    setMessages([{ autor: currentUser.name, text: message }, ...messages]);
  };

  return (
    <>
      <p>{!!onlineUsers ? onlineUsers : 0}</p>
      <p>
        {arrayUsers.map((user) => (
          <span>{user.name}</span>
        ))}
      </p>
      <form>
        <label>Enter name</label>
        <input
          onChange={(e) =>
            setCurrentUser({ name: e.target.value, id: nanoid() })
          }
          value={currentUser.name}
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <ul>
        {messages.map(({ autor, _id, text }) => (
          <li key={_id}>
            <span>{autor}</span>: {text}
          </li>
        ))}
      </ul>

      <form>
        <label>Enter message</label>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message.text}
        />
        <button onClick={sendMessage}>Submit</button>
      </form>
    </>
  );
}
