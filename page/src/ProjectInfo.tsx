import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProjectInfo() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Story" {...a11yProps(0)} />
          <Tab label="Project" {...a11yProps(1)} />
          <Tab label="Help me!" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Typography align="justify">
          <p><b>2048 NFT Cursed Transistors</b> are now released from the Teske's Lab cage to the Fantom Network Wilderness!
          The legend says that these transistors were burning circuits all over Teske's Lab project and that's why Lucas Teske
          decided to let them go to the fantom network. Some of them got attracted by some <a href="https://kittens.fakeworms.studio/">Fantom Kittens</a> in
          the way and <b>might appear</b> in your wallet if you have a kitten!</p>
          <p>You can retrieve the first <b>1024</b> for <b>1 FTM</b> each, and the last <b>1024</b> for <b>1.6 FTM</b> each.</p>
          <p>Some say there is still some cursed transistors hidden in Teske's Lab which might appear by suprise. <b>Stay tuned</b></p>

          <p style={{color:'red', textAlign:"center", fontWeight: "bold"}}>Use with care in new circuits! It might blow up everything else!</p>
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography align="justify">
          <p>The Cursed Transistor project was created by Lucas Teske after the incentive of his friends from <a href="https://twitter.com/FakewormsStudio">FakeWorms Studio</a>.
          </p>
          <p>There will be a first 1024 "early adopter" transistors batch with a golden
            frame around it where 419 of them will be airdroped for Fantom Kitten owners and
            the remaining 605 can be claimed for 1 FTM each. <b>There will never be any more than 1024 Golden Frame Cursed Transistors around</b></p>
          <p>After the first batch of 1024 cursed transistors is claimed, another batch of "common" cursed transistors will be available for 1.6 FTM each.</p>
          <p>If you missed both batches, you might still be able to earn one in Teske's Lab livestreams, events and raffles.
            These are minted as Special NFT with a Silver Frame around it and a message of what caused the NFT to be minted. Stay tuned!</p>
          <hr/>
          <p>
            <p>There are 4 types of transistors, each with two variants:</p>
            <div style={{textAlign:"center", width: "100%"}}><img alt="cursed-transistor types" src="/description.png"/></div>

            <p>Each transistor has 4 attributes in which 3 of them are common:</p>
            <ul>
              <li><b>Vmax</b> -&gt; Max voltage it can handle</li>
              <li><b>Imax</b> -&gt; Max current it can handle</li>
              <li><b>t</b> -&gt; Time it takes to get from on to off and vice-versa</li>
            </ul>
            And a specific one which depends on type of transistor:
            <ul>
              <li>FETs has <b>Rds(on)</b> which represents resistance when turned on</li>
              <li>Bipolar Junction has <b>Vce(on)</b> which represents voltage when turned on</li>
            </ul>

            These attributes depend on the transistor and are randomized when created. Each transistor is unique and have their characteristics.
            More details of how those attributes work will come in the future :D
          </p>
          <hr/>
          <p>
            Some new transistors might be created using the Special Frame (silver frame) in the following cases:
            <ul>
              <li>Achievements from Teske's Lab livestreams (which my include subscribes)</li>
              <li>Random Public Raffles (either in livestream or by lottery number)</li>
              <li>As a gift for partnership</li>
            </ul>
          </p>
          <hr/>
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography align="justify">
          <p>If you are new to the Fantom ecossystem, FakeWorms studio written a <a href="https://gist.github.com/MarcoWorms/78e71064e3a5c366b29b8a9ce01e1f19">small guide</a> on how to setup yourself to interact with Fantom services.</p>
          <p>Even if you missed the first 2048 batch, you might still get one in Teske's Lab livestreams or events.
            Keep posted in my <a href="https://twitter.com/lucasteske">Twitter</a> and/or <a href="https://twitch.tv/racerxdl">TwitchTV</a> for news!</p>
          <p><a href="https://discord.gg/WmyrjCrZyR">Join our discord</a> to interact with the Fantom Kittens community and Cursed Transistors community!</p>
          <p>Explore, buy, and sell all claimed cursed transistors at <a href={`https://paintswap.finance/marketplace/collections/${process.env.REACT_APP_CURSED_CONTRACT}`}>PaintSwap NFT Market</a></p>
        </Typography>
      </TabPanel>
    </Box>
  );
}
