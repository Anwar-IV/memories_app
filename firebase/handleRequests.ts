import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UsersList } from "../pages/[uid]/friends";
import { getUser, getUsers } from "./utils";

export function useHandleRequests(userId: string) {
  const [req2, setReq2] = useState<UsersList[]>([]);
  const [getRequestLoading, setGetRequestLoading] = useState<boolean>(false);

  useEffect(() => {
    setGetRequestLoading(true);
    const userdoc_ref = getUser(userId);

    const unsub = onSnapshot(userdoc_ref, async (doc) => {
      try {
        if (doc.exists()) {
          const newreq: any = [];
          const { requested } = doc.data() as UsersList;
          const users = await getUsers();
          if (users?.length! > 0) {
            users?.forEach((_user) => {
              if (requested?.includes(_user.id)) {
                newreq.push(_user);
              }
            });
            setReq2(newreq);
            setGetRequestLoading(false);
          }
        }
        setGetRequestLoading(false);
      } catch (error) {
        console.log({ error });
      }
    });
    return () => unsub();
  }, []);

  return { req2, getRequestLoading };
}
