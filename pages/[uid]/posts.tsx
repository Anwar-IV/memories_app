import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, firestore_instance } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { Post } from "../../components/post";
import { ToastContainer, toast } from "react-toastify";

export default function Posts() {
  const [postText, setPostText] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (postText.length > 300) {
        return toast.error(
          "You have exceeded the character limit. Max 300 characters allowed."
        );
      } else if (postText.length < 1)
        return toast.error("Text field is empty 😅");
      const postsRef = collection(
        firestore_instance,
        "users",
        user?.uid!,
        "posts"
      );
      await addDoc(postsRef, { post: postText, timestamps: serverTimestamp() });
      setPostText("");
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user]);

  return (
    <div className="flex flex-col w-full items-center">
      <form
        className="flex flex-col mt-16 shadow-xl md:w-124 sm:4/5 w-4/5 h-64 rounded-lg bg-sky-200 p-4 md:mx-5 relative"
        onSubmit={submitPost}
      >
        <label htmlFor="post-input-1" className=" mb-1 text-lg">
          Add a new post:
        </label>
        <textarea
          id="post-input-1"
          className="w-full resize-none h-24 rounded-lg outline-none focus:border-2 focus:border-cyan-400 pl-1 pt-1"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        <p className="mt-1 absolute top-36 opacity-90 text-cyan-600 font-medium">
          <span className={`${postText.length > 300 ? "text-red-400" : null}`}>
            {postText.length}
          </span>
          /300
        </p>
        <button
          className="absolute md:w-52 sm:w-4/5 md:left-36 bottom-8 sm:left-14 left-8 w-5/6 bg-cyan-500 rounded-lg py-2 opacity-90 shadow-md hover:opacity-100 transition-opacity ease-in-out duration-300 active:scale-98"
          type="submit"
        >
          Submit
        </button>
      </form>
      <div>
        {user?.uid && <Post userId={user?.uid} />}
        <ToastContainer position="top-left" />
      </div>
    </div>
  );
}
