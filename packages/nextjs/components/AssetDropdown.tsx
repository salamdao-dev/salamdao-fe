import React, { useEffect, useRef, useState } from "react";
import ChevronResponsive from "./ChevronResponsive";
import { Asset } from "./StakingBox";
import { useTheme } from "next-themes";

type AssetDropdownProps = {
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  assetList: Asset[];
};

const AssetDropdown = ({ selectedAsset, setSelectedAsset, assetList }: AssetDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAssetChange = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex space-between border-e-1 border-black" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={`w-[9rem] inline-flex items-center justify-between py-2 ${
          theme === "dark" ? "text-white" : "text-black"
        } cursor-pointer`}
      >
        {selectedAsset && selectedAsset.icon && (
          <img src={selectedAsset.icon} alt={selectedAsset.name} className="w-8 h-8 mr-4" />
        )}
        <div className="flex flex-col">
          <span className="text-lg select-none">{selectedAsset ? selectedAsset.symbol : "Select Asset"}</span>
        </div>
        <div className="pr-2">
          <ChevronResponsive isOpen={isOpen} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute bg-[#cebdba] shadow-md rounded mt-2 w-48 z-10">
          <div className="max-h-[25rem] overflow-auto custom-scroll">
            <div className="py-1 relative">
              {assetList.map(asset => (
                <div
                  key={asset.name}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:bg-opacity-80"
                  onClick={() => handleAssetChange(asset)}
                >
                  {asset.icon && <img src={asset.icon} alt={asset.name} className="w-4 h-4 inline-block mr-2" />}
                  <span className="select-none text-lg">{asset.symbol}</span>
                </div>
              ))}
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#cebdba] to-transparent"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDropdown;
