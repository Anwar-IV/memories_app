import { onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { UnaddedFriend } from "../../components/UnaddedFriends";
import { auth } from "../../firebase/config";
import { getUser } from "../../firebase/utils";
import { Post } from "../../components/post";
import { UsersList } from "./friends";

export default function WelcomeHome() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [permittedFriends, setPermittedFriends] = useState<string[]>();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && user) {
      const user_ref = getUser(user?.uid);

      const unsub = onSnapshot(user_ref, (snap) => {
        if (snap.exists()) {
          const { accepted } = snap.data() as UsersList;
          setPermittedFriends(accepted);
        }
      });

      console.log({ permittedFriends });
      return () => unsub();
    }
  }, [loading, user]);

  return (
    <>
      {!loading &&
      user &&
      permittedFriends?.includes(router?.query?.uid as string) ? (
        <div className="flex justify-center">
          <Post userId={router?.query?.uid as string} />
        </div>
      ) : !loading && user && router.query.uid !== user.uid ? (
        <UnaddedFriend userId={router.query.uid} visitingUser={user} />
      ) : (
        <div className="mt-28 md:w-[600px] sm:w-5/6 w-5/6 h-64 bg-sky-400 rounded-lg m-auto flex pt-4 flex-col align-center shadow-xl">
          <h1 className="text-3xl text-center text-sky-50">
            Welcome {user?.displayName}
          </h1>
          <div className="text-xl mt-4 text-center text-sky-50">
            What's on your mind today?
          </div>
          <ul className=" mx-auto flex flex-col gap-4 mt-4 text-lg">
            <Link href={`/${user?.uid}/posts`}>
              <li className="w-full bg-cyan-300 rounded-lg p-2 shadow-lg opacity-90 hover:opacity-100">
                Make a new Post
              </li>
            </Link>
            <Link href={`/${user?.uid}/friends`}>
              <li className="w-full bg-cyan-300 rounded-lg p-2 shadow-lg opacity-90 hover:opacity-100">
                Add a new Friend
              </li>
            </Link>
          </ul>
        </div>
      )}
    </>
  );
}
