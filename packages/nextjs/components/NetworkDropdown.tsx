import React, { useEffect, useRef, useState } from "react";
import { Network } from "../types/utils";
import ChevronResponsive from "./ChevronResponsive";
import { useTheme } from "next-themes";

type NetworkDropdownProps = {
  selectedNetwork: Network;
  setSelectedNetwork: (network: Network) => void;
  networkList: Network[];
  from: boolean;
};

const NetworkDropdown = ({ selectedNetwork, setSelectedNetwork, networkList, from }: NetworkDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    localStorage.setItem("selectedNetwork", network.id.toString());
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const lastSelectedNetwork = localStorage.getItem("selectedNetwork");
    if (lastSelectedNetwork) {
      const network = networkList.find(network => network.id === parseInt(lastSelectedNetwork));
      if (network) setSelectedNetwork(network);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={`inline-flex items-center py-2 ${theme === "dark" ? "text-white" : "text-black"} cursor-pointer`}
      >
        {selectedNetwork && selectedNetwork.icon && (
          <img src={selectedNetwork.icon} alt={selectedNetwork.name} className="w-8 h-8 mr-4" />
        )}
        <div className="flex flex-col items-start">
          <span className="text-xs select-none">{from ? "From" : "To"}</span>
          <span className="text-xl select-none">{selectedNetwork ? selectedNetwork.name : "Select Network"}</span>
        </div>
        <div className="pr-2">
          <ChevronResponsive isOpen={isOpen} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute bg-[#cebdba] shadow-md rounded mt-2 w-48 z-10 cursor-pointer">
          <div className="py-1">
            {networkList.map(network => (
              <div
                key={network.id}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:bg-opacity-80"
                onClick={() => handleNetworkSelect(network)}
              >
                {network.icon && <img src={network.icon} alt={network.name} className="w-8 h-8 inline-block mr-2" />}
                <span className="select-none">{network.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkDropdown;
