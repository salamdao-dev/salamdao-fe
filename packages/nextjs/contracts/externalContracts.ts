import DelegationSupervisor from "./abis/DelegationSupervisor.json";
import VaultSupervisor from "./abis/VaultSupervisor.json";
import { Abi } from "abitype";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

export type ExternalContracts = {
  [chainId: number]: {
    [contractName: string]: {
      address: string;
      abi: Abi;
    };
  };
};

const externalContracts: ExternalContracts = {
  1: {
    VaultSupervisor: {
      address: "0x54e44DbB92dBA848ACe27F44c0CB4268981eF1CC",
      abi: VaultSupervisor.abi as Abi,
    },
    DelegationSupervisor: {
      address: "0xAfa904152E04aBFf56701223118Be2832A4449E0",
      abi: DelegationSupervisor.abi as Abi,
    },
  },
  42161: {
    VaultSupervisor: {
      address: "0x399f22ae52a18382a67542b3De9BeD52b7B9A4ad",
      abi: VaultSupervisor.abi as Abi,
    },
    DelegationSupervisor: {
      address: "0x48769803c0449532Bd23DB3A413152632753c8f0",
      abi: DelegationSupervisor.abi as Abi,
    },
  },
  2410: {
    VaultSupervisor: {
      address: "0xB308474350D75447cA8731B7Ce87c9ee9DA03B1C",
      abi: VaultSupervisor.abi as Abi,
    },
    DelegationSupervisor: {
      address: "0xd3c4342f2b542f8c1Fc046F4E89195DeafA4a47E",
      abi: DelegationSupervisor.abi as Abi,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
