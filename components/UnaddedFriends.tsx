import { User } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore_instance } from "../firebase/config";
import { UsersPostsType } from "../firebase/useFirestore";
import { getDocuments } from "../firebase/utils";
import { UsersList } from "../pages/[uid]/friends";

type UnaddedFriendProps = {
  userId: string | undefined | string[];
  visitingUser: User;
};

export function UnaddedFriend({ userId, visitingUser }: UnaddedFriendProps) {
  const [visitedUser, setVisitedUser] = useState<UsersList>();
  const [requesting, setRequesting] = useState<boolean>(false);
  const [__posts, setPosts] = useState<UsersPostsType[]>(
    [] as UsersPostsType[]
  );

  const addFriend = async () => {
    try {
      setRequesting(true);
      const doc_ref = doc(firestore_instance, "users", userId as string);
      if (visitedUser?.requested?.includes(visitingUser.uid)) {
        await updateDoc(doc_ref, { requested: arrayRemove(visitingUser.uid) });
        console.log("Im adding");
      } else {
        await updateDoc(doc_ref, { requested: arrayUnion(visitingUser.uid) });
        console.log("im removing");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    const doc_ref = doc(firestore_instance, "users", userId as string);
    const unsub = onSnapshot(
      doc_ref,
      (doc) => {
        if (doc.exists()) {
          setVisitedUser(doc.data() as UsersList);
          setRequesting(false);
        }
      },
      (error) => {
        console.log({ error });
      },
      () => {}
    );
    getDocuments(userId as string).then((posts) => setPosts(posts!));
    return () => unsub();
  }, [userId]);

  return (
    <>
      {visitedUser && (
        <div className="mt-20 w-[600px] h-max py-4 bg-sky-200 rounded-lg m-auto shadow-xl flex pt-4 flex-col align-center">
          <h1 className="text-3xl text-center ">{visitedUser.displayName}</h1>
          <div className="mx-auto text-lg m-4">
            <p className="w-48 h-max p-4 bg-sky-300 shadow rounded-lg my-2">
              Friends: {visitedUser.accepted?.length}
            </p>
            <p className="w-48 h-max p-4 bg-sky-300 shadow rounded-lg my-2">
              Mutual Friends: 0
            </p>
            <p className="w-48 h-max p-4 bg-sky-300 shadow rounded-lg my-2">
              Posts: {__posts?.length}
            </p>
          </div>

          <button
            className="h-12 w-28 rounded-lg bg-cyan-400 shadow-lg mx-auto mt-4 opacity-90 hover:opacity-100 hover:border-blue-500 hover:border-2 cursor-pointer"
            onClick={addFriend}
          >
            {requesting
              ? "Requesting..."
              : visitedUser.requested?.includes(visitingUser.uid)
              ? "Requested"
              : "Add Friend"}
          </button>
        </div>
      )}
    </>
  );
}
