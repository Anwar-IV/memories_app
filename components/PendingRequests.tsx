import { User } from "firebase/auth";
import { IoMdPersonAdd } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { BsInfoCircleFill } from "react-icons/bs";
import { useHandleAdd, useHandleRemove } from "../firebase/useHandleAdd";
import { useHandleRequests } from "../firebase/handleRequests";
import Link from "next/link";

type PendingRequestsProps = {
  user: User;
};

type RequestedUsersType = {
  id: string;
  displayName: string;
};

export function PendingRequests({ user }: PendingRequestsProps) {
  const addFriend = (addedId: string, adderId: string) => {
    useHandleAdd(addedId, adderId);
  };
  const req2 = useHandleRequests(user.uid);
  const rejectRequest = (requester_id: string, rejecter_id: string) => {
    useHandleRemove(requester_id, rejecter_id, "requested");
  };

  return (
    <div
      className="h-96 w-80 bg-sky-200 shadow-xl rounded-lg text-center py-3"
      id="child_1"
    >
      <h1 className="text-lg">Pending Requests</h1>
      <div className="p-4 flex flex-col gap-3">
        {req2.length > 0 ? (
          req2.map((req_user) => (
            <div key={req_user.id}>
              <div className="flex gap-2 items-center w-full h-16 px-3">
                <p className="grow text-lg">{req_user.displayName}</p>
                <div className="flex gap-2">
                  <button
                    className="bg-emerald-300 p-2 rounded-lg "
                    type="button"
                    onClick={() => addFriend(req_user.id, user.uid)}
                  >
                    <IoMdPersonAdd size={18} color="#fefefe" />
                  </button>
                  <button
                    className="bg-red-300 p-2 rounded-lg "
                    onClick={() => rejectRequest(req_user.id, user.uid)}
                  >
                    <AiFillDelete size={18} color="#fefefe" />
                  </button>
                  <Link href={`/${req_user.id}`}>
                    <button className="bg-blue-300 p-2 rounded-lg">
                      <BsInfoCircleFill size={18} color="#fefefe" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>You currently have 0 requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
