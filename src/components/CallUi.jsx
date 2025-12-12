import { useCall } from "./CallContext";

export default function CallUI() {
  const { incomingCall, currentCall, acceptCall, rejectCall, endCall } = useCall();

  return (
    <>
      {incomingCall && (
        <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 z-50">
          <p className="text-black">Llamada entrante</p>
          <div className="flex gap-3 mt-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={acceptCall}>Aceptar</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={rejectCall}>Rechazar</button>
          </div>
        </div>
      )}

      {currentCall && (
        <div className="fixed bottom-6 left-6 bg-white shadow-xl rounded-lg p-3 z-50">
          <p className="text-black">En llamada...</p>
          <button className="bg-red-600 text-white px-4 py-2 mt-3 rounded" onClick={endCall}>Colgar</button>
        </div>
      )}
    </>
  );
}
