import * as React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {makeStyles} from "@material-ui/core/styles";
import {useWallet} from "use-wallet";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import {useContractMethods} from "./Web3";
import { ButtonGroup } from '@mui/material';

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
    tokenArrayContentData
  } = useContractMethods()
  let content;
  let transistorList;

  if (wallet.status === "connected") {
    content = (
      <div className={classes.rightContent}>
        <ButtonGroup variant="contained" orientation="vertical" aria-label="outlined primary button group" style={{width: '100%'}}>
          <Button onClick={claim}>Claim</Button> <br/>
          <Button onClick={() => listFromWallet(wallet.account || '', 0, 1024)}>List my transistors</Button>
        </ButtonGroup>
      </div>)
    if (tokenArrayContentData?.length > 0) {
      transistorList = (
        <div >
          <h1>Your Transistors</h1>
          <ImageList sx={{height: 450}} cols={4} rowHeight={224}>
            {tokenArrayContentData?.map((item: any) => (
              <ImageListItem
                key={item.image}
                onClick={() => window.open(`https://paintswap.finance/marketplace/assets/${process.env.REACT_APP_CURSED_CONTRACT}/${item.idx}`)}
                style={{cursor: 'pointer'}}
              >
                <img
                  src={`${item.image}?w=192&fit=crop&auto=format`}
                  alt={item.name}
                  loading="lazy"
                  style={{width: '192px'}}
                />

                <ImageListItemBar
                  title={`${item.name} #${item.idx}`}
                  position="below"
                  style={{width: '192px'}}
                />
              </ImageListItem>
            ))}
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
    <Paper sx={{maxWidth: 936, margin: 'auto', marginTop: '40px', padding: '16px'}}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div>
            <Typography align="justify">
              <b>2048 NFT Cursed Transistors</b> are now released from the Teske's Lab cage to the Fantom Network Wilderness!
              This is the website where you can claim yours and list every cursed transistor you have. We have two batches
              of 1024 transistors each. The first are the <b>Early Adopter</b> batch, in which 419 will be airdropped to
              Fantom Kitten (check <a href="https://twitter.com/FakewormsStudio">FakeWorms Studio</a> twitter for news),
              the other will be claimed here for <b>1 FTM</b> each. After the 1024 batch of Early Adopters end, there will be a
              batch of 1024 common transistors to be claimed for <b>1.6 FTM</b> each.<br/><br/>

              If you missed the first 2048 batches you might still get one in my livestreams! There will be special emissions
              with custom messages for public events, workshops and livestreams I attend.
              <br/>
              <br/>
              Keep posted in my <a href="https://twitter.com/lucasteske">Twitter</a> and/or <a href="https://twitch.tv/racerxdl">TwitchTV</a> for news!
              <br/>

              <a href="https://discord.gg/WmyrjCrZyR">Join our discord</a> to interact with the Fantom Kittens community and Cursed Transistors community!
              <br/>
              <br/>

              If you are new to the Fantom ecossystem, FakeWorms studio written a <a href="https://gist.github.com/MarcoWorms/78e71064e3a5c366b29b8a9ce01e1f19">small guide</a> on how to setup yourself to interact with Fantom services.
              <br/>Explore, buy, and sell all claimed kittens at <a href={`https://paintswap.finance/marketplace/collections/${process.env.REACT_APP_CURSED_CONTRACT}`}>PaintSwap NFT Market</a>

            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          {content}
        </Grid>
      </Grid>
      {transistorList}
    </Paper>
  );
}
