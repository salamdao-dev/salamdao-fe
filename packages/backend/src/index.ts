import { PrivateKeyAccount, isAddress, parseEther, parseUnits } from "viem";
import { privateKeyToAccount } from 'viem/accounts'

export interface Env {
	DEV_DB: D1Database;
	PROD_DB: D1Database;
	STAGE: string;
	PRIVATE_KEY: `0x${string}`;
	SALAMELS_ADDRESS: `0x${string}`;
}

type Claim = {
	eth_address: `0x${string}`;
	price: number;
	quantity: number;
}


const signData = async (account: PrivateKeyAccount, salamelsAddress: `0x${string}`, address: `0x${string}`, quantity: number, price: number) => {
	const domain = {
		name: 'Salamels',
		version: '1',
		chainId: 31337,
		verifyingContract: salamelsAddress,
	};

	const types = {
		Approved: [
			{ name: 'wallet', type: 'address' },
			{ name: 'quantity', type: 'uint256' },
			{ name: 'price', type: 'uint256' },
		],
	};

	const value = {
		wallet: address,
		quantity,
		price: parseUnits(price.toString(), 18),
	};

	const typedData = {
		domain: domain,
		types: types,
		primaryType: 'Approved' as const,
		message: value,
	};

	return await account.signTypedData(typedData);
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/api/claims") {
			const address = url.searchParams.get("address");
			if (!address) {
				return new Response("No address provided, please provide a valid ethereum address e.g. /api/claims?address=0xdeadbeef...", { status: 400 });
			}
			if (!isAddress(address)) {
				return new Response(`${address} is not a valid ethereum address`, { status: 400 });
			}

			const db = env.STAGE === "dev" ? env.DEV_DB : env.PROD_DB;

			const { results } = await db.prepare(
				"SELECT * FROM Claims WHERE eth_address = ?"
			)
				.bind(address)
				.all() as { results: Claim[] };

			if (results.length === 0) {
				return new Response("No claims found", { status: 400 });
			}

			const data = results[0];

			const privateKey = env.PRIVATE_KEY;

			if (!privateKey) {
				return new Response("No signer key found, reach out on Discord for support.", { status: 500 });
			}

			const account = privateKeyToAccount(privateKey as `0x${string}`);
			const salamelsAddress = env.SALAMELS_ADDRESS as `0x${string}`;

			console.log("salamelsAddress", salamelsAddress);

			const sig = await signData(account, salamelsAddress, data.eth_address, data.quantity, data.price);

			return new Response(JSON.stringify({ ...data, price: parseEther(data.price.toString()).toString(), sig }, null, 2));
		}

		return new Response(
			"Please provide a valid path, e.g. /api/claims?address=0xdeadbeef..."
		);
	},
} satisfies ExportedHandler<Env>;