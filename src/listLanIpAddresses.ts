
import os from 'os';

interface IResult {
  networkName: string;
  iface: os.NetworkInterfaceInfo;
};

// useful to test on local WiFi with a smartphone
export const listLanIpAddresses = (): IResult[] => {

  const allInterfaces: IResult[] = [];

  const interfaces = os.networkInterfaces();

  Object.keys(interfaces)
    .forEach((networkName) => {
      interfaces[networkName]?.forEach((iface) => {
        allInterfaces.push({networkName, iface});
      });
    });

  return allInterfaces;
};
