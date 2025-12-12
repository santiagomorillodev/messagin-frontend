export default function FollowComponent({photo}) {
  return (
    <div className='flex justify-between items-center px-4'>
        <div className="flex gap-3">
            <img src={photo} alt="" width='50px' className='rounded-full min-w-[50px] h-[50px] object-cover'/>
            <div className="">
                <p className="font-semibold">username</p>
                <p className="text-gray-400 font-semibold">full name</p>
            </div>
        </div>
        <button className="py-2 px-4 bg-red-500 rounded-3xl font-bold">Delete</button>
    </div>
  )
}
