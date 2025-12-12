import { useNavigate } from "react-router-dom";
import { ToggleSwitch } from "../components/ToggleSwitch"

export const Settings = () => {
    const navigate = useNavigate();
return (
    <>
    <div className="h-dvh bg-gray-200 dark:bg-neutral-800 shadow-2xl">

            <header>
                    <ul className="flex justify-between pt-3 px-4 text-lg bg-white dark:bg-neutral-900">
                            <li><i className='bx  bx-chevron-left text-blue-400 text-4xl cursor-pointer' onClick={() => navigate(-1)}></i> </li>
                            <li><p className="font-bold">Message settings</p></li>
                            <li><p className="font-bold text-blue-400 cursor-pointer">Done</p></li>
                    </ul>
            </header>
            <p className="text-xl text-gray-500 font-bold p-2">Settings</p>

            <section className="pl-4 py-3 bg-white dark:bg-neutral-900 flex flex-col gap-4">
                    

            <div className="flex flex-col gap-2">
                <div className="flex justify-between pr-4">
                    <h2 className="text-xl font-bold">Change email</h2>
                </div>
                <p className="text-sm text-gray-400">
                    Update your account email address for notifications and login. <span className="text-blue-400 cursor-pointer" onClick={() => navigate('/update/email')}>Change email</span>
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between pr-4">
                    <h2 className="text-xl font-bold">Change password</h2>
                </div>
                <p className="text-sm text-gray-400">
                    Change your account password to keep your account secure. <span className="text-blue-400 cursor-pointer" onClick={() => navigate('/update/password')}>Change password</span>
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between pr-4">
                    <h2 className="text-xl font-bold">Likes</h2>
                </div>
                <p className="text-sm text-gray-400">
                    In this section, you can see all the posts, photos, or statuses that the user has liked. It’s a quick way to review the content they’ve shown interest in or interacted with recently. <span className="text-blue-400 cursor-pointer" onClick={() => navigate('/likes')}>See likes</span>
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between pr-4">
                    <h2 className="text-xl font-bold">Delete account</h2>
                </div>
                <p className="text-sm text-gray-400">
                    In this section, you can delete your account permanently. This action cannot be undone. <span className="text-blue-400 cursor-pointer" onClick={() => navigate('/delete/account')}>Delete account</span>
                </p>
            </div>

        </section>

    </div>
    </>
)
}
