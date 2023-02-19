import { User } from "firebase/auth";
import { collection, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore_instance } from "../firebase/config";
import { useFirestore } from "../firebase/useFirestore";
import { getUser } from "../firebase/utils";
import { UsersList } from "../pages/[uid]/friends";

type PostProps = {
  userId: string;
};

export function Post({ userId }: PostProps) {
  const collection_ref = collection(
    firestore_instance,
    "users",
    userId,
    "posts"
  );
  const { docs } = useFirestore(collection_ref);
  const [displayName, setDisplayName] = useState<string>();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const user_ref = getUser(userId);

    getDoc(user_ref).then((doc) => {
      if (doc.exists()) {
        const { displayName } = doc.data() as UsersList;
        setDisplayName(displayName);
      }
    });
  }, []);

  return (
    <div className="mt-16 md:w-[700px] sm:w-[600px] min-[426px]:w-[400px] w-[345px] h-max">
      {docs.length < 1 ? (
        <p className="text-center">There are no posts</p>
      ) : (
        <>
          {user && user?.uid !== userId && (
            <div className="bg-sky-200 w-max p-3 rounded-lg m-auto text-lg shadow-lg">
              <p>{displayName}'s Posts</p>
            </div>
          )}
          {docs.map((post) => (
            <div
              key={post.id}
              className={
                "border border-blue-500 p-4 bg-cyan-400 my-4 rounded-lg w-full"
              }
            >
              <p className="text-sm text-sky-50 m-0 p-0">
                {post.timestamps?.toLocaleString()}
              </p>
              <p className="py-3 text-[20px]">{post.post}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
