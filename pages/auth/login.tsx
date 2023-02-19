import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { auth, firestore_instance } from "../../firebase/config";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  async function handleLogin() {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const user_doc_ref = doc(firestore_instance, "users", user.uid);
      const _document = await getDoc(user_doc_ref);
      if (_document.exists()) {
        return console.log("User alredy exists im returning");
      } else {
        await setDoc(user_doc_ref, {
          id: user.uid,
          displayName: user.displayName,
          picture: user.photoURL,
          email: user.email,
        });
        console.log("New user added");
      }
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    if (!loading && user) {
      console.log("redirect");
      router.push("/");
    }
  }, [user, loading]);

  return (
    <div className="h-full w-full flex justify-center">
      <div className="bg-sky-400 p-5 rounded-lg mt-20 w-124 mx-4 h-72 shadow-lg">
        <h2 className="text-4xl text-center text-white">Join Today</h2>
        <div className="flex flex-col h-5/6 mt-3 text-lg">
          <h3 className="grow">
            Click the link below to sign in with your Google account and get
            started today.
          </h3>
          <button
            className="shadow-md bg-teal-400 py-2 px-4 rounded-lg text-lg flex gap-4 justify-center relative opacity-90 hover:opacity-100 transition-all active:scale-98 "
            type="button"
            onClick={handleLogin}
          >
            <FcGoogle
              size={36}
              style={{
                position: "absolute",
                left: "20px",
                transform: "translate(0, -2.5px)",
              }}
            />
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
