"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "stake",
    href: "/",
  },
  {
    label: "bridge",
    href: "/bridge",
  },
  {
    label: "dashboard",
    href: "/dashboard",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <div className="flex flex-row w-full items-center">
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            href={href}
            key={href}
            className="group transition-all duration-300 ease-in-out px-4 cursor-pointer text-[2rem]"
          >
            <span
              className={
                isActive
                  ? "bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:100%_1px] bg-no-repeat"
                  : `bg-left-bottom bg-gradient-to-r ${
                      theme === "dark" ? "from-white to-white" : "from-black to-black"
                    } bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-all duration-300 ease-out`
              }
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  const { theme } = useTheme();

  return (
    <div className="relative sticky lg:static top-0 navbar min-h-0 justify-between z-21 px-0 sm:px-2">
      <div className="navbar-start w-full">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-[20rem] h-[4rem] ml-8">
            <Image
              alt="Salam logo"
              className="cursor-pointer"
              fill
              src={`${theme === "dark" ? "/Salam_Logo_White.svg" : "/Salam_Logotype_Black.svg"}`}
            />
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-row lg:flex-nowrap pr-[12rem] mx-auto">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
