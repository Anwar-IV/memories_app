import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { UsersList } from "../pages/[uid]/friends";
import { firestore_instance } from "./config";
import { UsersPostsType } from "./useFirestore";

export async function getUsers() {
  try {
    const collection_ref = collection(firestore_instance, "users");
    const querySnapshot = await getDocs(collection_ref);
    const users: UsersList[] = [];
    querySnapshot.forEach((doc) => {
      const { displayName, id, picture, email, requested, accepted } =
        doc.data() as UsersList;
      users.push({ displayName, id, picture, email, requested, accepted });
    });
    return users;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export function getUser(userID: string) {
  const doc_ref = doc(firestore_instance, "users", userID);

  return doc_ref;
}

export const getDocuments = async (userId: string) => {
  try {
    const posts_ref = collection(
      firestore_instance,
      "users",
      userId as string,
      "posts"
    );

    const posts: UsersPostsType[] = [] as UsersPostsType[];
    const q__ = query(posts_ref, orderBy("timestamps", "desc"));
    const value = await getDocs(q__);
    if (!value.empty) {
      value.forEach((__post) => {
        const { post, timestamps } = __post.data() as {
          post: string;
          timestamps: Timestamp;
        };
        posts.push({
          id: __post.id,
          post,
          timestamps: timestamps.toDate(),
        });
      });
      return posts;
    } else {
      console.log("Posts are empty");
      return null;
    }
  } catch (error) {
    console.log({ error });
    return null;
  }
};
