import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useDesktopView } from "../context/DesktopViewContext";
import useGetUser from "../hooks/useGetUser";
import Error from "./Error";
import useGetLastMessage from "../hooks/useGetLastMessage";
import { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext.jsx";
import { useFormatMessageTime } from "../hooks/useFormatMessageTime";
import { useChatSummaryMenu } from "../hooks/useChatSummaryMenu";

export const ChatSummary = ({ idUser, conversationId }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { socket, unreadByConversation, setUnreadByConversation } = useWebSocket();

  const [menu, setMenu] = useState(false);
  const [visibility, setVisibility] = useState(true);
  const [isDelete, setIsDelete] = useState(false);

  // ==============================
  // GET USER
  // ==============================
  const { user, loading: userLoading, error: userError } = useGetUser(idUser);

  // ==============================
  // GET LAST MESSAGE
  // ==============================
  const {
    lastMessage,
    countUnreadMessages,
    loading: lastLoading,
    error: lastError
  } = useGetLastMessage(conversationId);

  const unread = unreadByConversation[conversationId] ?? countUnreadMessages ?? 0;

  const [message, setMessage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const time = useFormatMessageTime(message?.created);
  const loading = !loaded && (userLoading || lastLoading);
  const error = userError || lastError;

  // ==============================
  // MENÚ + DELETE
  // ==============================
  const { toggleMenu, startHold, cancelHold, deleteConversation } =
    useChatSummaryMenu({
      setMenu,
      setVisibility,
      setIsDelete,
    });

  // ==============================
  // CARGA INICIAL DEL ÚLTIMO MENSAJE
  // ==============================
  useEffect(() => {
    if (lastMessage && !loaded) {
      setMessage(lastMessage);
      setLoaded(true);
    }
  }, [lastMessage, loaded]);

  // ==============================
  // LIVE UPDATES POR WEBSOCKET
  // ==============================
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (event) => {
      const data = event.detail;
      if (data.conversation_id === conversationId) {
        setMessage({
          content: data.content,
          created: data.createdAt,
        });
      }
    };

    window.addEventListener("new-message", handleNewMessage);
    return () => window.removeEventListener("new-message", handleNewMessage);
  }, [socket, conversationId]);

  // ==============================
  // LOADING / ERROR / USER NULL
  // ==============================
  if (loading) return <div className="p-4 opacity-50">Cargando chat...</div>;
  if (error) return <Error error={error} />;
  if (!user) return null;

  const id = user.id;
  const name = user.name;
  const status = user.status;
  const photo = user.avatar_url;
  const chatId = conversationId;
  const statusText = status ? "En línea" : "Desconectado";
  const followerCount = user.follows;

  // ==============================
  // CLICK => ABRIR CHAT
  // ==============================
  const handleClick = async () => {
    if (menu) return;

    const response = await fetch(`https://messagin-backend.onrender.com/inbox/message/change-status/${chatId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log(response)

    setUnreadByConversation((prev) => ({
      ...prev,
      [chatId]: 0,
    }));

    if (isDesktop) {
      try {
        const { changeView } = useDesktopView();
        changeView("chat", {
          id,
          name,
          photo,
          chatId,
          status,
          statusText,
          followerCount,
        });
      } catch {}
    } else {
      navigate("/direct", {
        state: {
          id,
          name,
          photo,
          chatId,
          status,
          statusText,
          followerCount,
        },
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={toggleMenu}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      className={`w-full flex gap-2 text-white ${
        menu ? "bg-red-500" : "bg-second"
      } border-b border-gray-200 md:dark:bg-neutral-800 px-4 py-2 cursor-pointer relative ${
        isDelete ? "hidden" : ""
      }`}
    >
      {/* Avatar */}
      <div className="flex relative">
        <img
          src={photo}
          alt="user"
          width="50"
          className="rounded-full min-w-[50px] h-[50px] object-cover"
        />
        <span className="absolute bottom-0 right-0">
          <i
            className={
              status
                ? "bx bxs-circle text-green-500"
                : "bx bxs-circle text-red-500"
            }
          ></i>
        </span>
      </div>

      {/* Info del chat */}
      <div className="w-full p-1 overflow-hidden relative">
        <div className="w-full flex justify-between">
          <span className="font-bold text-sm">{name}</span>
          <span className={`text-end text-sm ${visibility ? "" : "hidden"}`}>
            {time ?? "—"}
          </span>
        </div>

        <p className="truncate text-neutral-500 text-sm">
          {message?.content ?? ""}
        </p>

        {unread > 0 && (
          <p className="absolute bottom-0 right-0 size-5 bg-green-500 rounded-full flex items-center justify-center">
            {unread}
          </p>
        )}
      </div>

      {/* Botón de eliminar */}
      {menu && (
        <div
          className="text-white px-3 py-2 bg-red-500 flex items-center gap-2 z-10 cursor-pointer"
          onClick={() => deleteConversation(idUser)}
        >
          <i className="bx bxs-trash text-white text-3xl hover:text-red-800 hover:text-4xl"></i>
        </div>
      )}
    </div>
  );
};
