import { useDesktopView } from "../context/DesktopViewContext";

export function StatusUser ({name, time, photo})  {
  let changeView = () => {};
  try {
    ({ changeView } = useDesktopView());
  } catch {
    // Si falla el contexto, dejamos changeView como función vacía para evitar errores.
  }
  return (
    <div className='flex gap-4' onClick={() => changeView('status', { name, photo })}>
        <img src={photo} alt="" width='50px' className='rounded-full min-w-[50px] h-[50px] object-cover border-2 border-blue-400'/>
        <div>
            <p className="text-sm">{name}</p>
            <p className="text-sm">{time}</p>
        </div>
    </div>
  )
}
