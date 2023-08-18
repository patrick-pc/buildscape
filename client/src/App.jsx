import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics } from "@react-three/rapier";
import { Suspense, useState, useEffect, useRef } from "react";
import { socket, SocketManager } from "./components/SocketManager";

function App() {
  const [player, setPlayer] = useState({
    name: "",
    guild: "erevald",
    class: "founder",
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const playerComplete = player.name && player.guild && player.class;

  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  function handleSendMessage() {
    if (chatMessage.trim()) {
      socket.emit("sendChatMessage", chatMessage);
      setChatMessage("");
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    socket.on("receiveChatMessage", (message) => {
      setChatMessages([...chatMessages, message]);
    });

    return () => {
      socket.off("receiveChatMessage"); // This will ensure that the listener is removed when the component is unmounted or if the effect re-runs.
    };
  }, [chatMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const joinGame = () => {
    if (!playerComplete) {
      alert("please fill out all fields");
      return;
    }

    socket.emit("join", player);
    setIsGameStarted(true);
  };

  return (
    <>
      <SocketManager />

      {isGameStarted ? (
        <>
          <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
            <color attach="background" args={["#ececec"]} />
            <Suspense>
              <Physics>
                <Experience />
              </Physics>
            </Suspense>
          </Canvas>

          {/* Chat UI */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "24px",
              width: "400px",
              background: "rgba(0,0,0,0.6)",
            }}
          >
            <div
              ref={messagesEndRef}
              className="p-2"
              style={{ overflowY: "auto", maxHeight: "200px" }}
            >
              {chatMessages.map((message, index) => (
                <div key={index}>
                  <strong className="text-gray-100">{message.sender}:</strong>{" "}
                  {message.message}
                </div>
              ))}
            </div>
            <input
              className="w-full px-2 py-1 focus:outline-none"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyUp={handleKeyPress}
            />
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-80">
          <div className="w-full flex items-center justify-center gap-2">
            <p className="w-12">name:</p>
            <input
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
              className="w-full max-w-xs border px-2 py-1 focus:outline-none"
              maxLength={16}
            />
          </div>

          <div className="w-full flex items-center justify-center gap-2">
            <p className="w-12">guild:</p>
            <select
              value={player.guild}
              onChange={(e) => setPlayer({ ...player, guild: e.target.value })}
              className="w-full max-w-xs border px-2 py-1 focus:outline-none"
            >
              <option value="erevald">erevald</option>
              <option value="gaudmire">gaudmire</option>
              <option value="alterok">alterok</option>
              <option value="spectreseek">spectreseek</option>
            </select>
          </div>

          <div className="w-full flex items-center justify-center gap-2">
            <p className="w-12">class:</p>
            <select
              value={player.class}
              onChange={(e) => setPlayer({ ...player, class: e.target.value })}
              className="w-full max-w-xs border px-2 py-1 focus:outline-none"
            >
              <option value="founder">founder</option>
              <option value="engineer">engineer</option>
              <option value="creator">creator</option>
              <option value="musician">musician</option>
              <option value="designer">designer</option>
              <option value="investor">investor</option>
              <option value="techbro">tech bro</option>
            </select>
          </div>

          <button
            onClick={joinGame}
            className="w-96 border bg-black text-white px-2 py-1"
          >
            enter buildscape
          </button>
        </div>
      )}
    </>
  );
}

export default App;
