import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UsersList } from "../pages/[uid]/friends";
import { firestore_instance } from "./config";

export function usebackupRequests(userId: string) {
  const [requestedUsers, setRequestedUsers] = useState<UsersList[]>(
    [] as UsersList[]
  );

  useEffect(() => {
    const user_ref = doc(firestore_instance, "users", userId);
    const unsub = onSnapshot(user_ref, (doc) => {
      if (doc.exists()) {
        //Get the "Requested" Array
        const { requested } = doc.data() as UsersList;

        //Check "Requested" array has any requests
        if (requested?.length! > 0) {
          // We need to set an outer array to push the docs to
          // Loop through each "Requested"
          requested?.forEach((user) => {
            // Query for each userid in "Requested"
            // Where the id matches the document
            const q = query(
              collection(firestore_instance, "users"),
              where("id", "==", user)
            );

            //Add a snapshot listener on the document
            onSnapshot(
              q,
              (docs) => {
                //This is the inner array we push to first
                // We are getting the WHOLE user document
                const user_docs: UsersList[] = [];
                if (!docs.empty) {
                  docs.forEach((doc) => {
                    user_docs.push(doc.data() as UsersList);
                  });
                }
                console.log({ user_docs });
                setRequestedUsers(user_docs);
              },
              (error) => console.log({ error })
            );
          });
        }
      }
    });
    return () => unsub();
  }, [userId]);
  return requestedUsers;
}
