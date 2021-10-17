import React from "react";
import Web3 from "web3";
import {useWallet} from "use-wallet";
import cursedTransistor from "./artifacts/CursedTransistor.json";

export const earlySupplyPrice = 1.0e18;
export const commonSupplyPrice = 1.6e18;
export const maxEarlySupply = 1024;

export const useWeb3 = () => {
  const france: React.MutableRefObject<Web3 | undefined> = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  React.useEffect(() => {
    france.current = new Web3(window.ethereum);
    contract.current = new france.current.eth.Contract(
      cursedTransistor.abi as any,
      process.env.REACT_APP_CURSED_CONTRACT
    );
  });

  return [france, contract];
};

export const useContractMethods = () => {
  const [, contract] = useWeb3();
  const [totalSupply, setTotalSupply] = React.useState<undefined | number>();
  const [commonSupply, setCommonSupply] = React.useState<undefined | number>();
  const [earlySupply, setEarlySupply] = React.useState<undefined | number>();
  const [specialSupply, setSpecialSupply] = React.useState<undefined | number>();
  const [tokenArrayContentData, setTokenArrayContentData] = React.useState<undefined | any>()
  const [loading, setLoading] = React.useState<undefined|boolean>()

  const wallet = useWallet();

  const tokensRangeFromWallet = async (wallet: string, start: number, end: number): Promise<string[]> => {
    const tokensP = [];
    for (let i = start; i < end; i++) {
      tokensP.push(contract.current?.methods.tokenOfOwnerByIndex(wallet, i).call())
    }
    return Promise.all(tokensP);
  }

  const getTokenURI = async (tokenIdx: string): Promise<any> => ({
    idx: tokenIdx,
    uri: await contract.current?.methods.tokenURI(tokenIdx).call(),
  })

  const getTokenURIs = async (tokenIds: string[]): Promise<any[]> => Promise.all(tokenIds.map(getTokenURI))

  const getTokenData = async ({uri, idx}: any): Promise<any | null> => {
    try {
      const res = await fetch(uri)
      if (res === null) {
        return null
      }
      const data = await res.json();
      data.idx = idx;
      return data
    } catch (e) {
      console.log(e);
      return null
    }
  }

  const listFromWallet = async (wallet: string, start: number = 0, end: number | void) => {
    const ownerBalance = await contract.current?.methods.balanceOf(wallet).call().then((supply: string) => Number(supply));
    if (ownerBalance !== 0) {
      const endStop = !end || end > ownerBalance ? ownerBalance : end;
      const tokens = await tokensRangeFromWallet(wallet, start, endStop)
      const tokenData = await getTokenURIs(tokens)
      const tokenContent = await Promise.all(tokenData.map(getTokenData))
      return setTokenArrayContentData(tokenContent.filter(o => o !== null));
    }
  }

  const claim = async () => {
    const earlies = await contract.current?.methods.earlyAdopterSupply().call().then((supply: string) => Number(supply));
    let price = earlySupplyPrice;
    if (earlies >= maxEarlySupply) {
      price = commonSupplyPrice;
    }
    setLoading(true)
    const tx = await contract.current.methods.claim().send({
      from: wallet?.account as string,
      value: price,
    });
    // Refresh supplies
    getTotalSupply()
    getCommonSupply()
    getEarlyAdopterSupply()
    await listFromWallet(wallet.account || '', 0, 1024)
    setLoading(false)
    return tx
  };

  const getTotalSupply = () =>
    contract.current?.methods
      .totalSupply()
      .call()
      .then((supply: string) => setTotalSupply(Number(supply)));

  const getCommonSupply = () =>
    contract.current?.methods
      .commonSupply()
      .call()
      .then((supply: string) => setCommonSupply(Number(supply)));

  const getEarlyAdopterSupply = () =>
    contract.current?.methods
      .earlyAdopterSupply()
      .call()
      .then((supply: string) => setEarlySupply(Number(supply)));

  const getSpecialSupply = () =>
    contract.current?.methods
      .specialSupply()
      .call()
      .then((supply: string) => setSpecialSupply(Number(supply)));

  return {
    claim,
    getTotalSupply, totalSupply,
    getCommonSupply, commonSupply,
    getEarlyAdopterSupply, earlySupply,
    getSpecialSupply, specialSupply,
    listFromWallet,
    tokenArrayContentData,
    loading
  };
};
