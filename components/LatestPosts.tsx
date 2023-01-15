import { User } from "firebase/auth";
import { collectionGroup } from "firebase/firestore";
import { firestore_instance } from "../firebase/config";
import { useLimitFirestore } from "../firebase/useFirestore";

type LatestPostsProps = {
  user: User;
};

export function LatestPosts({ user }: LatestPostsProps) {
  const collection_ref = collectionGroup(firestore_instance, "posts");
  const { docs } = useLimitFirestore(collection_ref, 4);
  return (
    <div
      className="h-96 w-124 bg-sky-200 shadow-xl rounded-lg text-center py-3"
      id="child_3"
    >
      <h1 className="text-lg">Latest Posts</h1>
      <div
        className="h-80 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
        id="latest-posts"
      >
        {docs.length > 0 &&
          docs.map((post) => (
            <div
              key={post.id}
              className="p-3 bg-[#11ccff] my-2 w-4/5 m-auto rounded-lg"
            >
              <div className="flex flex-col">
                <p className="text-sm self-start text-[#fefefe]">
                  {post.timestamps.toLocaleString()}
                </p>
                <p>{post.post}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
