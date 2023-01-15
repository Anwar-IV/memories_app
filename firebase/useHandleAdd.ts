import { arrayRemove, arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import { firestore_instance } from "./config";
import { getUser } from "./utils";

export async function useHandleAdd(addedId: string, adderId: string) {
  try {
    const user_ref = getUser(adderId);
    const added_user_ref = getUser(addedId);
    if (user_ref && added_user_ref) {
      await updateDoc(user_ref, {
        accepted: arrayUnion(addedId),
      });
      await updateDoc(added_user_ref, {
        accepted: arrayUnion(adderId),
      });
      await updateDoc(user_ref, {
        requested: arrayRemove(addedId),
      });
    }
  } catch (error) {
    console.log({ error });
  }
}

export async function useHandleRemove(
  addedId: string,
  adderId: string,
  from: "accepted" | "requested"
) {
  try {
    const user_ref = getUser(adderId);
    const added_user_ref = getUser(addedId);
    if (user_ref && added_user_ref) {
      if (from === "accepted") {
        await updateDoc(user_ref, {
          accepted: arrayRemove(addedId),
        });
        await updateDoc(added_user_ref, {
          accepted: arrayRemove(adderId),
        });
      } else if (from === "requested") {
        console.log({ addedId });
        await updateDoc(user_ref, {
          requested: arrayRemove(addedId),
        });
      }
    }
  } catch (error) {
    console.log({ error });
  }
}
