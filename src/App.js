import React, { useState, useEffect } from 'react';
import './App.css';
import loadWeb3 from './loadWeb3';
import Verification from './abis/Verification.json';

function App() {
	loadWeb3();
	const [account, setAccount] = useState('');
	const [messageHash, setMessageHash] = useState('');
	const [sign, setSign] = useState('');
	const [contract, setContract] = useState({});
	const [createdAcccount, setCreatedAccount] = useState('');
	const [initialLoading, setInitialLoading] = useState(false);
	const [signLoading, setSignLoading] = useState(true);
	const [verificationLoading, setVerificationLoading] = useState(true);

	useEffect(() => {
		loadWeb3();
		loadAccount();
	}, []);

	const web3 = window.web3;
	const loadAccount = async () => {
		// Load account
		const accounts = await web3.eth.getAccounts();
		let currentAccount = accounts[0];
		setAccount(currentAccount);
		const networkId = await web3.eth.net.getId();
		const networkData = Verification.networks[networkId];
		if (networkData) {
			const verification = new web3.eth.Contract(Verification.abi, networkData.address);
			setContract(verification);
		} else {
			window.alert('Contract not deployed to detected network.');
		}
	};

	const verifySignature = async (msgHash, signature) => {
		const result = await contract.methods.recover(msgHash, signature).call();
		setCreatedAccount(result);
		setVerificationLoading(false);
	};

	const esign = async (e, msg) => {
		e.preventDefault();
		let msgHash = web3.utils.sha3(msg);
		let signature = await web3.eth.sign(msgHash, account).then(console.log('success'));
		setSign(signature);
		setMessageHash(msgHash);
		setSignLoading(false);
	};

	return (
		<div className="App">
			<h1>Sample Signature verification DApp</h1>
			<p>User Account is {account}</p>
			<div>
				<form>
					<input type="text" onChange={(e) => setMessageHash(e.target.value)} />
					<button onClick={(e) => esign(e, messageHash)}>Sign it</button>
				</form>
			</div>
			{signLoading ? (
				<div></div>
			) : (
				<div>
					<p>Message Hash is {messageHash}</p>

					<p>Signature is {sign}</p>
					{console.log(contract)}
					<button
						onClick={(e) => {
							verifySignature(messageHash, sign);
						}}
					>
						Verify signature
					</button>
				</div>
			)}

			{verificationLoading ? <div></div> : <div>Account of signed message is {createdAcccount}</div>}
		</div>
	);
}

export default App;
