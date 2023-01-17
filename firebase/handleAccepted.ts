import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UsersList } from "../pages/[uid]/friends";
import { getUser, getUsers } from "./utils";

export function useGetAccepted(userId: string) {
  const [acceptedFriends, setAcceptedFriends] = useState<UsersList[]>([]);
  const [getFriendsLoading, setGetFriendsLoading] = useState<boolean>(false);

  useEffect(() => {
    setGetFriendsLoading(true);
    const user_ref = getUser(userId);

    const unsub = onSnapshot(user_ref, async (doc) => {
      if (doc.exists()) {
        const { accepted } = doc.data() as UsersList;

        const users = await getUsers();

        if (users?.length! > 0) {
          const new_accept: UsersList[] = [];
          users?.forEach((user) => {
            if (accepted?.includes(user.id)) {
              new_accept.push(user);
            }
          });
          setAcceptedFriends(new_accept);
          setGetFriendsLoading(false);
        }
      }
      setGetFriendsLoading(false);
    });
    return () => unsub();
  }, []);
  return { acceptedFriends, getFriendsLoading };
}
