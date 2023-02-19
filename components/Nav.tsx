import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/config";
import { MdOutlineClose } from "react-icons/md";
import { motion } from "framer-motion";
import Head from "next/head";

type NavProps = {
  hovering: boolean;
  setHovering: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Nav({ hovering, setHovering }: NavProps) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const handleClick = () => {
    setHovering(false);
    localStorage.setItem("ran", "true");
  };

  const handleSignout = async () => {
    try {
      await signOut(auth);
      handleClick;
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading]);

  return (
    <>
      <Head>
        <title>Memories</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/light.svg" />
      </Head>
      <nav className="flex justify-between relative">
        <Link href={"/"} className={"ml-7 text-3xl mt-1 text-white"}>
          <h1>Memories</h1>
        </Link>
        {user && (
          <div className="flex relative">
            {/* 
              ------HERE IN CASE IMG DOESN'T WORK------
            <svg
              width="50px"
              height="40px"
              viewBox="0 0 24 24"
              fill="#03fcd3"
              className="mt-1 transition-all cursor-pointer mr-3"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setHovering(!hovering)}
            >
              <g clip-path="url(#a)" fill="">
                <path d="M12 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1ZM4.929 3.515a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 0 0 1.414-1.414L4.93 3.515ZM1 11a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H1ZM18 12a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM17.657 16.243a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 1 0 1.414-1.414l-2.828-2.828ZM7.757 17.657a1 1 0 1 0-1.414-1.414L3.515 19.07a1 1 0 1 0 1.414 1.414l2.828-2.828ZM20.485 4.929a1 1 0 0 0-1.414-1.414l-2.828 2.828a1 1 0 1 0 1.414 1.414l2.828-2.828ZM13 19a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
              </g>

              <defs>
                <clipPath id="a">
                  <path fill="#000000" d="M0 0h24v24H0z" />
                </clipPath>
              </defs>
            </svg> */}
            {localStorage.getItem("ran") != "true" && (
              <motion.div
                initial={{ y: -1000 }}
                animate={{ y: 0 }}
                transition={{ delay: 1, type: "spring" }}
                onClick={handleClick}
                className="w-36 text-center h-40 rounded-lg mt-4 bg-green-400 absolute right-16 flex justify-center items-center p-4 shadow-lg"
              >
                <p>Click on the light ray logo to navigate around memories</p>
              </motion.div>
            )}

            <img
              src="/light.svg"
              alt="light"
              className="mt-1 mr-3 transition-all cursor-pointer w-12"
              onClick={() => {
                localStorage.setItem("ran", "true");
                setHovering(!hovering);
              }}
            />
            <div
              className={
                hovering
                  ? `w-64 h-56 flex flex-col mr-14 text-lg mt-1 text-white rounded-lg bg-sky-400 p-2 shadow-xl fixed right-1.5`
                  : "hidden"
              }
            >
              <div className="grow">
                <span className="flex">
                  <p>Hey {user.displayName}</p>
                  <div
                    className="ml-auto bg-red-400 cursor-pointer opacity-90 hover:opacity-100 w-8 rounded-lg flex justify-center "
                    onClick={handleClick}
                  >
                    <MdOutlineClose size={30} />
                  </div>
                </span>

                <ul className="mt-4">
                  <Link href={`/${user.uid}`} onClick={handleClick}>
                    <li className="bg-sky-400 opacity-80 my-1 pl-2 hover:opacity-100 hover:border-l hover:border-white rounded-md cursor-pointer">
                      Dashboard
                    </li>
                  </Link>
                  <Link href={`/${user?.uid}/posts`} onClick={handleClick}>
                    <li className="bg-sky-400 opacity-80 my-1 pl-2 hover:opacity-100 hover:border-l hover:border-white rounded-md cursor-pointer">
                      Posts
                    </li>
                  </Link>
                  <Link href={`/${user.uid}/friends`} onClick={handleClick}>
                    <li className="bg-sky-400 opacity-80 my-1 pl-2 hover:opacity-100 hover:border-l hover:border-white rounded-md cursor-pointer">
                      Friends
                    </li>
                  </Link>
                </ul>
              </div>
              <button
                type="button"
                onClick={handleSignout}
                className={
                  hovering
                    ? `text-l text-white rounded-lg bg-red-400 p-2 shadow-xl opacity-80 hover:opacity-100 transition-opacity`
                    : "hidden"
                }
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
