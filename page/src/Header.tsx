import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import {useWallet} from 'use-wallet'
import makeBlockie from 'ethereum-blockies-base64';

const lightColor = 'rgba(255, 255, 255, 0.7)';

export default function Header() {
  const wallet = useWallet()

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              {wallet.status === 'connected' ? (<div>Wallet: {wallet.account}</div>) : (<div/>)}
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
                  <Avatar
                    src={
                      wallet.status === 'connected' ?
                        makeBlockie(wallet.account || '') :
                        "/static/images/avatar/1.jpg"
                    }
                    alt={wallet.account || ''}
                  />
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
