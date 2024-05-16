"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
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
    href: "https://karak.network/bridge",
  },
  {
    label: "dashboard",
    href: "/dashboard",
  },
  {
    label: "salamels",
    href: "/salamels",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <div className="flex flex-row w-full items-center space-x-4">
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            href={href}
            key={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            className="group transition-all duration-300 ease-in-out cursor-pointer text-sm sm:text-base md:text-lg lg:text-3xl"
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
    <div className="relative sticky lg:static top-0 navbar min-h-0 justify-between z-21 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between">
        <div className="lg:hidden" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box fixed"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-[8rem] h-[2rem] sm:w-[10rem] sm:h-[2.5rem] md:w-[12rem] md:h-[3rem] lg:w-[15rem] lg:h-[3.5rem] xl:w-[20rem] xl:h-[4rem]">
            <Image
              alt="Salam logo"
              className="cursor-pointer"
              fill
              src={`${theme === "dark" ? "/Salam_Logo_White.svg" : "/Salam_Logotype_Black.svg"}`}
            />
          </div>
        </Link>
        <div className="hidden lg:flex lg:flex-row lg:flex-nowrap mx-auto">
          <HeaderMenuLinks />
        </div>
        <div className="mr-4">
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </div>
  );
};
