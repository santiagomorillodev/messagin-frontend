import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import { useDesktopView } from "../context/DesktopViewContext";
import useGetMessages from "../hooks/useGetMessages";
import { MessageContainer } from "../components/MessageContainer";
import { useLocation, useNavigate } from "react-router-dom";
import CallButton from "../components/CallButton";
import { useCallContext } from "../context/CallContext"; 

const Chat = () => {
const callApi = useCallContext();

const call = callApi?.call;
const acceptCall = callApi?.acceptCall;
const rejectCall = callApi?.rejectCall;
const endCall = callApi?.endCall;
const inCall = callApi?.inCall
const incomingCall = callApi?.incomingCall;
const remoteAudio = callApi?.remoteAudio;


  const { socket, send } = useWebSocket();
  const navigate = useNavigate();
  const { currentUser } = useGetCurrentUser();
  const location = useLocation();
  const [listDelete, setListDelete] = useState([]);
  const [Visibility, setVisibility] = useState([]);

  const desktopContext = (() => {
    try {
      return useDesktopView();
    } catch {
      return null;
    }
  })();

  const [liveMessages, setLiveMessages] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [inputContent, setInputContent] = useState("");

  const [initialLoad, setInitialLoad] = useState(true);
  const inputRef = useRef();

  const chatData = location.state || {};
  const { id, name, photo, chatId, status } = chatData || {};

  const otherUserId = id;

  const { messages = [], loading = false } = useGetMessages({
    conversationId: chatId
  });
  console.log({'Mensajes': messages})
  useEffect(() => {
    if (!loading && initialLoad) {
      setLiveMessages(messages || []);
      setInitialLoad(false);
    }
  }, [loading, messages, initialLoad]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (event) => {
      const data = event.detail;
      if (data.conversation_id !== chatId) return;

      setLiveMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.content === data.content &&
            msg.image_base64 === data.image_base64 &&
            msg.sender_id === data.sender_id &&
            msg.created === data.created
        );

        return exists ? prev : [...prev, data];
      });
    };

    window.addEventListener("new-message", handleNewMessage);
    return () => window.removeEventListener("new-message", handleNewMessage);
  }, [socket, chatId]);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const payload = {
      sender_id: currentUser.id,
      recipient_id: otherUserId,
      conversation_id: chatId,
      content: inputContent || null,
      image_base64: null
    };

    if (selectedImage) {
      const reader = new FileReader();

      reader.onload = () => {
        payload.image_base64 = reader.result;
        socket.send(JSON.stringify(payload));
        setSelectedImage(null);
        setInputContent("");
      };

      reader.readAsDataURL(selectedImage);
      return;
    }

    send(JSON.stringify(payload));
    setInputContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDelete = async () => {
    for (const id of listDelete) {
      const response = await fetch(
        `https://messagin-backend.onrender.com/inbox/message/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (response.ok) {
        setVisibility((prev) => [...prev, id]);
      }
    }
    setListDelete([]);
  };

  console.log('📍 Datos de location.state:', chatData);
console.log('🔑 chatId obtenido:', chatId);
console.log('🔗 URL completa:', window.location.href);

  if (!currentUser) return <p className="text-white">Cargando usuario...</p>;
  if (!name)
    return (
      <div className="flex justify-center items-center h-full text-white">
        <p>No hay chat seleccionado</p>
      </div>
    );
  if (initialLoad)
    return (
      <div className="flex justify-center items-center h-full text-white">
        <p>Cargando chat...</p>
      </div>
    );


  return (
    <div className="w-full h-screen flex flex-col overflow-hidden select-none">

      {/* UI DE LLAMADA ENTRANTE */}
      {incomingCall && (
        <div className="absolute top-4 left-0 right-0 mx-auto bg-neutral-800 text-white w-[90%] p-4 rounded-md shadow-lg z-50">
          <p>{incomingCall.from} te está llamando...</p>
          <div className="flex gap-4 mt-3">
            <button
              onClick={acceptCall}
              className="bg-green-600 px-4 py-2 rounded-md"
            >
              Aceptar
            </button>
            <button
              onClick={rejectCall}
              className="bg-red-600 px-4 py-2 rounded-md"
            >
              Rechazar
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center w-full py-2 bg-first text-white">
        <div className="flex items-center cursor-pointer">
          <button onClick={() => navigate("/inbox")}>
            <i className="bx bx-chevron-left text-3xl cursor-pointer"></i>
          </button>
          <img
            src={photo}
            width="45px"
            className="rounded-full min-w-[45px] h-[45px] object-cover cursor-pointer mr-2"
            onClick={() => navigate("/profile", { state: { id } })}
          />
          <div>
            <p>{name}</p>
            <p>{status ? "Active now" : "Inactive"}</p>
          </div>
        </div>

        {/* BOTÓN DE LLAMADA */}
        <CallButton targetId={otherUserId}/>

        <i
          className={`bx bxs-trash text-4xl pr-6 cursor-pointer ${
            listDelete.length > 0 ? "text-red-500" : ""
          }`}
          onClick={handleDelete}
        ></i>
      </header>

      {/* MENSAJES */}
      <main className="flex flex-col gap-3 py-4 pr-6 pl-3 overflow-y-auto scroll-hidden flex-grow bg-second">
        {liveMessages.length > 0 ? (
          liveMessages.map((message, idx) => (
            <MessageContainer
              key={`${message.created}-${message.sender_id}-${idx}`}
              id={message.message_id}
              contenido={message.content}
              image={message.image_url}
              sender={currentUser.id === message.sender_id}
              listDelete={listDelete}
              setListDelete={setListDelete}
              Visibility={Visibility}
            />
          ))
        ) : (
          <p>No hay mensajes aún</p>
        )}
      </main>

      {/* REMOTE AUDIO */}
      <audio ref={remoteAudio} autoPlay />

      {/* PREVIEW IMAGEN */}
      {selectedImage && (
        <div className="w-[70%] p-3 bg-white rounded-md border border-white mx-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <p className="text-black font-medium">Imagen seleccionada</p>
            <button
              className="text-red-500 text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              <i className="bx bx-x"></i>
            </button>
          </div>

          <img
            src={URL.createObjectURL(selectedImage)}
            className="max-h-48 rounded-lg object-contain mx-auto"
          />
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-neutral-800 w-full flex gap-2 items-center py-3 px-4">
        {!inputContent.trim() && !selectedImage && (
          <div className="chat-icons flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setSelectedImage(file);
              }}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <i className="bx bx-camera text-3xl text-white"></i>
            </label>
          </div>
        )}

        <textarea
          ref={inputRef}
          placeholder="Send a message"
          className="outline-0 w-full bg-transparent resize-none overflow-y-auto max-h-[72px] text-white"
          rows={1}
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {(inputContent.trim() || selectedImage) && (
          <button className="text-white text-3xl px-2" onClick={sendMessage}>
            <i className="bx bx-send"></i>
          </button>
        )}
      </footer>
    </div>
  );
};

export default Chat;
