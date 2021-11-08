import * as React from 'react';
import {useWallet} from "use-wallet";
import web3 from 'web3';
import {useContractMethods} from "./Web3";
import {
  ButtonGroup, Paper, Button,
  ImageList, ImageListItem, ImageListItemBar,
  LinearProgress,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import ProjectInfo from "./ProjectInfo";
import {SPECIAL_START_ID} from "./api/api";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  rightContent: {
    display: "flex",
    minHeight: "100%",
    minWidth: "100%",
    alignItems: "center",
    align: "center",
    padding: "10px",
  }
});

export default function Content() {
  const classes = useStyles();
  const wallet = useWallet()
  const {
    claim,
    listFromWallet,
    tokenArrayContentData,
    getEarlyAdopterSupply, earlySupply,
    commonSupply, getCommonSupply,
    loading,
  } = useContractMethods()
  let content;
  let transistorList;

  const loadingBar = loading ? <LinearProgress/> : <div/>
  const history = useHistory()

  if (wallet.status === "connected") {
    getEarlyAdopterSupply()
    getCommonSupply()
    listFromWallet(wallet.account || '', 0, 1024)
    const claimAvailable = (commonSupply || 0) < 1024;
    const claimButtonMessage = (earlySupply || 0) >= 1024 ? "Claim for 1.6 FTM" : "Claim Early for 1 FTM";
    const claimButton = claimAvailable ? <Button onClick={claim}>{claimButtonMessage}</Button> :
      <Button disabled>No more available</Button>
    content = (
      <div>
        <ButtonGroup variant="contained" orientation="horizontal" aria-label="outlined primary button group">
          {claimButton}<br/>
          <Button onClick={() => listFromWallet(wallet.account || '', 0, 1024)}>List my transistors</Button>
          <Button
            onClick={() => window.open(`https://paintswap.finance/marketplace/collections/${process.env.REACT_APP_CURSED_CONTRACT}`)}
          >Collection in Paintswap</Button>
          <Button
            onClick={() => window.open(`https://artion.io/explore/${process.env.REACT_APP_CURSED_CONTRACT}`)}
          >Collection in Artion</Button>
        </ButtonGroup>
        <br/>
        <br/>
        {loadingBar}
      </div>)
    if (tokenArrayContentData?.length > 0) {
      transistorList = (
        <div>
          <h1>Your Transistors</h1>
          <ImageList sx={{height: 450}} cols={4} rowHeight={224}>
            {tokenArrayContentData?.map((item: any) => {
              const idx = item.special ? `S${web3.utils.toBN(item.idx).sub(SPECIAL_START_ID).toString()}` : item.idx;
              return <ImageListItem
                key={item.image}
                onClick={() => history.push(`/metrics/${item.idx}`)}
                style={{cursor: 'pointer'}}
              >
                <img
                  src={`${item.image}?w=192&fit=crop&auto=format`}
                  alt={item.name}
                  loading="lazy"
                  style={{width: '192px'}}
                />

                <ImageListItemBar
                  title={`${item.name} #${idx}`}
                  position="below"
                  style={{width: '192px'}}
                />
              </ImageListItem>
            })}
          </ImageList>
        </div>
      )
    } else {
      transistorList = <div/>
    }
  } else {
    content = <div className={classes.rightContent}>
      Connect a wallet to mint or manage Cursed Transistors
    </div>
    transistorList = <div/>
  }

  return (
    <div>
      <img alt="Cursed Transistor Showcase" src="/transistorheader.png" height="256"/>
      <Paper sx={{maxWidth: 936, margin: 'auto', marginTop: '40px', padding: '2vh', paddingTop: '2vh'}}>
        <div>
          {content}
        </div>
        <ProjectInfo/>
        {transistorList}
      </Paper>
    </div>
  );
}
