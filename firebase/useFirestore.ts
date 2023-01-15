import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore_instance } from "./config";

export type UsersPostsType = {
  post: string;
  id: string;
  timestamps: Date;
};

export function useFirestore(_ref: Query<DocumentData>) {
  const [docs, setDocs] = useState<UsersPostsType[]>([]);
  useEffect(() => {
    const q = query(_ref, orderBy("timestamps", "desc"));
    const unsub = onSnapshot(q, (next: any) => {
      if (next.empty) {
        console.log("Doc is empty");
      } else {
        const _documents: UsersPostsType[] = [];
        next.forEach((doc: any) => {
          const { timestamps } = doc.data() as { timestamps: Timestamp };
          _documents.push({
            ...(doc.data()! as { post: string }),
            id: doc.id,
            timestamps: timestamps?.toDate(),
          });
        });

        setDocs(() => _documents);
      }
    });
    return () => unsub();
  }, []);
  return { docs };
}

export function useLimitFirestore(_ref: Query<DocumentData>, _limit: number) {
  const [docs, setDocs] = useState<UsersPostsType[]>([]);

  useEffect(() => {
    const q = query(_ref, orderBy("timestamps", "desc"), limit(_limit));
    const unsub = onSnapshot(q, (next: any) => {
      if (next.empty) {
        console.log("Doc is empty");
      } else {
        const _documents: UsersPostsType[] = [];
        next.forEach((doc: any) => {
          const { timestamps } = doc.data() as { timestamps: Timestamp };
          _documents.push({
            ...(doc.data()! as { post: string }),
            id: doc.id,
            timestamps: timestamps?.toDate(),
          });
        });

        setDocs(() => _documents);
      }
    });
    return () => unsub();
  }, []);
  return { docs };
}
