import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast, ToastContainer } from "react-toastify";
import { AddedFriends } from "../../components/AddedFriends";
import { LatestPosts } from "../../components/LatestPosts";
import { PendingRequests } from "../../components/PendingRequests";
import { auth, firestore_instance } from "../../firebase/config";
import { getUsers } from "../../firebase/utils";

export type UsersList = {
  displayName: string;
  picture: string;
  email: string;
  id: string;
  accepted?: string[];
  requested?: string[];
};

export default function Friends() {
  const [usersList, setUserList] = useState<UsersList[] | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [user, loading, error] = useAuthState(auth);
  const [text, setText] = useState("");
  const router = useRouter();

  const searchFriends = async () => {
    try {
      if (text == "") {
        return toast.error("Search field is empty 😅");
      }
      setSearchLoading(true);
      const users = await getUsers();
      if (users) {
        const filteredUsers: UsersList[] = [];
        users.forEach((list) => {
          const lowerDisplayName = list.displayName.toLowerCase();
          const lowerText = text.toLowerCase();
          const includes = lowerDisplayName.includes(lowerText);
          includes && user?.uid !== list.id
            ? filteredUsers.push({ ...list })
            : null;
        });
        setUserList(filteredUsers);
      }
      setSearchLoading(false);
    } catch (error) {
      console.log({ error });
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading]);

  return (
    <div className="w-max h-max mx-auto">
      <div
        className="bg-sky-200  mx-auto shadow-xl min-h-56 max-h-max pb-4 w-124 w-36 mt-36 rounded-lg flex flex-col align-center"
        id="searchbox_1"
      >
        <h1 className="py-4 text-center text-2xl">Add a new friend:</h1>
        <div className="flex w-[400px] h-max mx-auto" id="search-io">
          <input
            type="text"
            className="min-w-[350px] h-12 rounded-lg shadow-md outline-none focus:border-2 focus:border-blue-500 pl-1 text-lg font-medium text-xl"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="min-w-20 h-12 ml-2 bg-sky-300 px-2 rounded-lg shadow-lg hover:border-blue-500 hover:border cursor-pointer"
            onClick={searchFriends}
          >
            Search
          </button>
        </div>
        {usersList?.length! > 0 && (
          <div
            className={
              "w-4/5 mx-auto mt-2 min-h-36 max-h-max rounded-lg shadow-md p-4"
            }
          >
            {searchLoading ? (
              <p>Loading search results...</p>
            ) : (
              usersList &&
              usersList?.map((user, index) => (
                <div
                  key={index}
                  className="my-2 p-4 border-2 border-white rounded-lg"
                >
                  <Link href={`/${user?.id}`}>
                    <p className="text-xl">{user.displayName}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <ToastContainer position="top-left" />
      <div className="w-[1200px] h-96  md:mt-16 flex gap-8" id="friend_1">
        {user && <PendingRequests user={user} />}
        {user && <AddedFriends user={user} />}
        {user && <LatestPosts user={user} />}
      </div>
    </div>
  );
}
