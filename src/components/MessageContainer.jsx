import useMessageSelection from "../hooks/useMessageSelection";

export function MessageContainer({
  id,
  contenido,
  sender,
  status,
  image,
  Visibility,
  setListDelete
}) {
  const {
    menu,
    handleContextMenu,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
  } = useMessageSelection(id, setListDelete);

  return (
    <div
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={
        sender
          ? `ml-auto ${menu ? "bg-red-500" : "bg-fourth"} text-white rounded-xl p-2 mb-2 max-w-xs flex flex-col w-[70%] ${
              Visibility.includes(id) ? "hidden" : ""
            }`
          : "bg-neutral-900 text-black rounded-xl p-2 mb-2 max-w-xs flex flex-col w-[70%]"
      }
    >
      {image && <img src={image} alt="message" className="rounded-md mt-2" />}

      <span className="text-white">{contenido}</span>

      {sender ? (
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-white">05:44</span>
          <i className={`bx ${status ? "bx-check-circle" : "bx-check"} text-white text-xs`}></i>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-white">05:44</span>
        </div>
      )}
    </div>
  );
}
