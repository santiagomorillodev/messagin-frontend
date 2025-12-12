import { useNavigate, useLocation } from "react-router-dom";

export function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDesktop = location.pathname.startsWith("/desktop");

  const go = (path) => {
    if (isDesktop) {
      navigate(`/desktop${path === "/" ? "" : path}`);
    } else {
      navigate(path);
    }
  };


  return (
    <nav>
      <ul className="flex justify-between md:justify-start md:gap-5 py-3 px-10 md:px-7 fixed md:static bottom-0 left-0 w-full bg-second text-white z-50 border-t border-neutral-500 md:border-0 md:flex-col md:w-2 md:items-center">
        <li><i className="bx bx-message text-3xl cursor-pointer" onClick={() => go("/inbox")} /></li>

        <li><i className="bx bx-search text-3xl cursor-pointer" onClick={() => go("/search")} /></li>

        <li className="relative">
          <i className="bx bx-bell text-3xl cursor-pointer" onClick={() => go("/notification")} />
        </li>

        <li><i className="bx bx-pin text-3xl cursor-pointer" onClick={() => go("/status")} /></li>
      </ul>
    </nav>
  );
}
