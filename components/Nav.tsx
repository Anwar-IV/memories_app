import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/config";
import { MdOutlineClose } from "react-icons/md";
import Head from "next/head";

export function Nav() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [hovering, setHovering] = useState(false);

  const handleSignout = async () => {
    try {
      await signOut(auth);
      setHovering(false);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
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
        {!user ? (
          <Link
            href={"/auth/login"}
            className={
              "mr-14 text-l mt-1 text-white rounded-lg bg-cyan-400 p-2 shadow-md hover:opacity-80 transition-opacity"
            }
          >
            Join Now
          </Link>
        ) : (
          <div className="flex">
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
            <img
              src="/light.svg"
              alt="light"
              className="mt-1 mr-3 transition-all cursor-pointer w-12"
              onClick={() => setHovering(!hovering)}
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
                    onClick={() => setHovering(false)}
                  >
                    <MdOutlineClose size={30} />
                  </div>
                </span>

                <ul className="mt-4">
                  <Link
                    href={`/${user.uid}`}
                    onClick={() => setHovering(false)}
                  >
                    <li className="bg-sky-400 opacity-80 my-1 pl-2 hover:opacity-100 hover:border-l hover:border-white rounded-md cursor-pointer">
                      Dashboard
                    </li>
                  </Link>
                  <Link
                    href={`/${user?.uid}/posts`}
                    onClick={() => setHovering(false)}
                  >
                    <li className="bg-sky-400 opacity-80 my-1 pl-2 hover:opacity-100 hover:border-l hover:border-white rounded-md cursor-pointer">
                      Posts
                    </li>
                  </Link>
                  <Link
                    href={`/${user.uid}/friends`}
                    onClick={() => setHovering(false)}
                  >
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
