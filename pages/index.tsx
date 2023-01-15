import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      router.push(`/${user.uid}`);
    }
  }, [user, loading]);
  return (
    <>
      <Head>
        <title>Memories</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/light.svg" />
      </Head>
      <div className="md:w-[700px] w-5/6 h-64 m-auto bg-sky-400 mt-24 rounded-lg shadow-md flex flex-column justify-center">
        <div className=" text-center mt-8 text-sky-50">
          <h1 className="text-3xl">Welcome to Memories</h1>
          <div className="mt-4">
            <h1 className="text-xl">...the best social app on the internet</h1>
          </div>
          <div>
            <p className="mt-4 text-lg">
              Sign up today with one of our providers
            </p>
            <div className="mt-4">
              <Link href={"/auth/login"}>
                <button className="w-28 h-12 bg-sky-300 hover:border-2 hover:border-blue-500 rounded-lg shadow-lg cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
