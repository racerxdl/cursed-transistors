import * as React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {makeStyles} from "@material-ui/core/styles";
import {useWallet} from "use-wallet";
import {Card} from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import {useContractMethods} from "./Web3";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #9013FE 15%, #50E3C2 90%)",
    minWidth: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  card: {
    maxWidth: "80%",
    minHeight: "40vh",
    display: "flex",
    alignItems: "center"
  }
});


export default function Content() {
  const classes = useStyles();
  const wallet = useWallet()
  const {
    claim,
    getTotalSupply, totalSupply,
    getCommonSupply, commonSupply,
    getEarlyAdopterSupply, earlySupply,
    listFromWallet,
    tokenArrayContentData
  } = useContractMethods()
  let content;
  let transistorList;

  if (wallet.status === "connected") {
    getTotalSupply()
    getCommonSupply()
    getEarlyAdopterSupply()
    content = (<div>
      Total Supply: {totalSupply} <br/>
      Common Supply: {commonSupply} <br/>
      Early Supply: {earlySupply} <br/>
      <Button onClick={claim}>Claim</Button>
      <Button onClick={() => listFromWallet(wallet.account || '', 0, 1024)}>List my transistors</Button>
    </div>)
    if (tokenArrayContentData?.length > 0) {
      transistorList = (
        <div>
          <h1>Your Transistors</h1>
          <ImageList sx={{height: 450}} cols={4} rowHeight={224}>
            {tokenArrayContentData?.map((item: any) => (
              <ImageListItem
                key={item.image}
                onClick={() => window.open(`https://paintswap.finance/marketplace/assets/${process.env.REACT_APP_CURSED_CONTRACT}/${item.idx}`)}>
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
    content = <div>
      <Card sx={{}} className={classes.card}>
        Connect a wallet to mint or manage Cursed Transistors
      </Card>
    </div>
    transistorList = <div/>
  }

  return (
    <Paper sx={{maxWidth: 936, margin: 'auto', paddingTop: '40px'}}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div>
            <Typography align="justify">
              Hi, this is Cursed Transistors.<br/>
              <br/>
              And I have no clue what to write here<br/>
              <br/>
              <br/>
              Contract: {process.env.REACT_APP_CURSED_CONTRACT}
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
