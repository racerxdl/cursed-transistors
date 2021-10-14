import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import {useWallet} from 'use-wallet'
import makeBlockie from 'ethereum-blockies-base64';
import {Badge, Tooltip} from "@mui/material";
import {useContractMethods} from "./Web3";

const lightColor = 'rgba(255, 255, 255, 0.7)';

export default function Header() {
  const wallet = useWallet()
  const {
    getCommonSupply, commonSupply,
    getEarlyAdopterSupply, earlySupply,
    getSpecialSupply, specialSupply,
  } = useContractMethods()
  let supplyIcons = (<div/>)

  if (wallet.status === "connected") {
    getCommonSupply()
    getEarlyAdopterSupply()
    getSpecialSupply()

    supplyIcons = (
      <div>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Tooltip title="Early Adopter Minted Transistors" >
              <Badge badgeContent={earlySupply} color={(earlySupply||0) >= 1024 ? "error" : "info"}>
                <img width={48} alt="Early Adopter Icon" src="/earlyAdopterIcon.png"/>
              </Badge>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Common Minted Transistors">
              <Badge badgeContent={commonSupply} color={(commonSupply||0) >= 1024 ? "error" : "info"}>
                <img width={48} alt="Common Icon" src="/commonIcon.png"/>
              </Badge>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Special Minted Transistors">
              <Badge badgeContent={specialSupply} color="info">
                <img width={48} alt="Special Icon" src="/specialIcon.png"/>
              </Badge>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    )
  }

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              {supplyIcons}
            </Grid>
            <Grid item xs/>
            <Grid item>
              {
                wallet.status === 'connected' ? (
                  <div>
                    <Button
                      sx={{borderColor: lightColor}}
                      variant="outlined"
                      color="inherit"
                      size="small"
                      onClick={() => wallet.reset()}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      sx={{borderColor: lightColor}}
                      variant="outlined"
                      color="inherit"
                      size="small"
                      onClick={() => wallet.connect('injected')}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )
              }
            </Grid>
            <Grid item>
              <IconButton color="inherit" sx={{p: 0.5}}>
                {
                  <Tooltip title={wallet.account||''}>
                    <Avatar
                      src={
                        wallet.status === 'connected' ?
                          makeBlockie(wallet.account || '') :
                          "/static/images/avatar/1.jpg"
                      }
                      alt={wallet.account || ''}
                    />
                  </Tooltip>
                }
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{zIndex: 0}}
      >
      </AppBar>
    </React.Fragment>
  );
}
