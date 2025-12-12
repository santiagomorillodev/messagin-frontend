import UserSearchComponent from '../components/UserSearchComponent';
import { NavigationBar } from '../components/NavigationBar';
import Header from "../components/Header";
import { useState } from "react";
import useSearchUser from "../hooks/useSearchUser";
import useGetRecentSearch from "../hooks/useGetRecentSearch";

export function SearchPage() {
  const [data, setData] = useState('');
  const { user, query, setQuery } = useSearchUser();
  const { recentSearch, setRecentSearch } = useGetRecentSearch(); // 👈 usamos el setter

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.trim() !== '') {
      setQuery(data);
    }
  };

  const handleRemove = (id) => {
    setRecentSearch((prev) => prev.filter((u) => u.id !== id));
  };

  console.log(user);
  console.log(recentSearch)

  return (
    <section className="border-r border-neutral-500 md:min-w-[385px]">
      <Header sectionName={"Search user"} />

      <form className="w-full flex items-center px-4 py-2" onSubmit={handleSubmit}>
        <input
          type="text"
          aria-label="Search"
          value={data}
          placeholder="Search..."
          className="p-2 bg-second placeholder:text-gray-400 w-full rounded-2xl outline-0"
          onChange={(e) => setData(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="sr-only">Search</button>
      </form>

      <main className="mb-15">
        {query && (
          <UserSearchComponent
            photo={user?user.avatar_url:null}
            name={user?user.name:'Searching...'}
            username={`@${user&&user.username}`}
            currentSearch={true}
            id={user?user.id:null}
            status={user?user.status:false}
            followerCount={user?user.follows:0}
          />
        )}

        <p className="text-gray-400 text-sm px-4 py-2 font-bold">Recent</p>

        <section className="flex flex-col border-b border-neutral-500 pb-3">
          {recentSearch && recentSearch.length > 0 ? (
            recentSearch.map((user) => (
              <UserSearchComponent
                key={user.id}
                id={user.id}
                photo={user.avatar_url}
                name={user.name}
                username={`@${user.username}`}
                onRemove={handleRemove} // 👈 pasamos la función
                currentSearch={false}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm">No recent searches</p>
          )}
        </section>
      </main>

      <div className="md:hidden">
        <NavigationBar />
      </div>
    </section>
  );
}
