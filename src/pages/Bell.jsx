import { useNavigate } from 'react-router-dom'
import { BellComponent } from '../components/BellComponent'
import { NavigationBar } from '../components/NavigationBar'
import Header from '../components/Header'
import useGetNotifications from '../hooks/useGetNotifications'

export function Bell ()  {
  const navigate = useNavigate()
  const { notifications } = useGetNotifications()
  console.log(notifications);

  return (
    <section className='md:min-w-[385px] border-r border-neutral-500'>
        <Header sectionName={'Notifications'}/>

        <section className='flex flex-col gap-3 border-b border-neutral-500 py-3 bg-second mt-3'>
          {notifications ? notifications.map((notification) => (
            <BellComponent
              key={notification.id}
              content={notification.content}
              photo={notification.avatar_url}
              username={notification.username}
              id={notification.id}
            />
          )) 
          : <main className="bg-white dark:bg-neutral-900 md:dark:bg-neutral-800 w-full flex flex-col gap-5 md:gap-0 mb-15 md:mb-0">
              <p className="text-center mt-4 text-neutral-400">No tienes notificaciones aún</p>
            </main>}
        </section>

        <div className='md:hidden'>
          <NavigationBar />
        </div>

    </section>
  )
}
