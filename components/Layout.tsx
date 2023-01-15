import { ReactNode } from "react";
import { Nav } from "./Nav";
import "react-toastify/dist/ReactToastify.css";

type LayoutProps = {
  children: ReactNode;
};

import { Poppins } from "@next/font/google";
import Head from "next/head";

const poppins_400 = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export function Layout({ children }: LayoutProps) {
  return (
    <div className={`${poppins_400.className}`}>
      <div className="max-w-full bg-gradient-to-r from-cyan-500 to-blue-400 h-12 fixed w-full z-50 top-0">
        <Nav />
      </div>
      <div>{children}</div>
    </div>
  );
}
