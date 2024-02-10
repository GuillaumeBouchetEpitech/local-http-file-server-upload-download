
import express from 'express';
import config from 'config';

import { listLanIpAddresses } from "./listLanIpAddresses"

import * as middlewares from "./middlewares"
import * as routes from "./routes"

const app = express();

app.use(middlewares.accessLoggerMiddleware);
app.use(routes.getFolderOrFile);
app.use(routes.postFileToUpload);

const port = config.get<number>('port');
const host = config.get<string>('host');

app.listen(port, host, () => {
  console.log(`Listening for requests... (${host}:${port})`);

  const allIpAddresses = listLanIpAddresses();

  allIpAddresses
    .filter((data) => data.iface.family.toLowerCase() === 'ipv4')
    .sort((valA, valB) => valB.networkName.localeCompare(valA.networkName))
    .forEach((data) => {
      const name = data.networkName.padEnd(10);
      const family = data.iface.family.padEnd(10);
      console.log(" -> ".padStart(10), name, family, `http://${data.iface.address}:${port}/`)
    });

  console.log();
  console.log();

});

