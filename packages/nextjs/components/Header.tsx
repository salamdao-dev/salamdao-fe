"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useAudio } from "~~/context/AudioContext";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "NFT",
    href: "/",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <div className="flex flex-row w-full justify-center space-x-8">
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
  const { shouldPlayAudio, setShouldPlayAudio } = useAudio();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioPath = `${process.env.PUBLIC_URL || ""}/salam_soundtrack.mp3`;

      const newAudio = new Audio(audioPath);
      newAudio.loop = true;
      setAudio(newAudio);
    }
  }, []);

  useEffect(() => {
    if (shouldPlayAudio && audio) {
      audio.play().catch(error => {
        console.error("Failed to play audio:", error);
      });
    } else if (audio) {
      audio.pause();
    }
  }, [shouldPlayAudio, audio]);

  return (
    <div className="sticky top-0 z-20 w-full px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-row sm:grid sm:grid-cols-3 items-center mx-auto max-w-7xl">
        <div className="flex justify-start">
          <Link href="/" passHref>
            <Image alt="Salam logo" width={500} height={109} src="/Salam_Logo_Color.svg" className="w-full h-auto" />
          </Link>
        </div>

        <div className="hidden sm:flex justify-center">
          <HeaderMenuLinks />
        </div>

        <div className="hidden sm:flex justify-end flex-row">
          <div onClick={() => setShouldPlayAudio(!shouldPlayAudio)}>
            <img
              src="/muted.svg"
              alt="muted"
              className={`w-auto h-full mr-4 ${!shouldPlayAudio ? "block" : "hidden"}`}
            />
            <img
              src="/unmuted.svg"
              alt="unmuted"
              className={`w-auto h-full mr-4 ${shouldPlayAudio ? "block" : "hidden"}`}
            />
          </div>
          <div className="flex items-center">
            <RainbowKitCustomConnectButton />
          </div>
        </div>

        <div className="sm:hidden col-start-3 justify-self-end" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-8 w-8" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 absolute right-0"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
              <li>
                <RainbowKitCustomConnectButton />
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
