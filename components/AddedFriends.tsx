import { User } from "firebase/auth";
import Link from "next/link";
import { AiFillDelete } from "react-icons/ai";
import { BsInfoCircleFill } from "react-icons/bs";
import { useGetAccepted } from "../firebase/handleAccepted";
import { useHandleRemove } from "../firebase/useHandleAdd";

type AddedFriendsProps = {
  user: User;
};

export function AddedFriends({ user }: AddedFriendsProps) {
  const { acceptedFriends, getFriendsLoading } = useGetAccepted(user.uid);
  const removeFriend = (added_id: string, adder_id: string) => {
    useHandleRemove(added_id, adder_id, "accepted");
  };

  return (
    <div
      className="h-96 w-80 bg-sky-200 shadow-xl rounded-lg text-center py-3"
      id="child_2"
    >
      <h1 className="text-lg">Friends</h1>
      <div
        style={{ scrollbarWidth: "none" }}
        className="p-4 flex flex-col gap-3 h-80 overflow-y-auto"
        id="latest-posts"
      >
        {acceptedFriends?.length > 0 ? (
          acceptedFriends?.map((acc_user) => (
            <div key={acc_user.id}>
              <div className="flex gap-2 items-center w-full h-16 px-3">
                <p className="grow text-lg">{acc_user.displayName}</p>
                <button
                  className="bg-red-300 p-2 rounded-lg "
                  onClick={() => removeFriend(acc_user.id, user.uid)}
                >
                  <AiFillDelete size={18} color="#fefefe" />
                </button>
                <Link href={`/${acc_user.id}`}>
                  <button className="bg-blue-300 p-2 rounded-lg">
                    <BsInfoCircleFill size={18} color="#fefefe" />
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : getFriendsLoading ? (
          <div>We are fetching your friends for you...</div>
        ) : (
          <div>
            <h1>You currently have 0 friends</h1>
          </div>
        )}
      </div>
    </div>
  );
}
