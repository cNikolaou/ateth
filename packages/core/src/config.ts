type ContractAddresses = {
  eas: string;
  schemaRegistry: string;
};

export const contracts: { [chainId: number]: ContractAddresses } = {
  1: {
    eas: '0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587',
    schemaRegistry: '0xA7b39296258348C78294F95B872b282326A97BDF',
  },
  11155111: {
    eas: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
    schemaRegistry: '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0',
  },
  10: {
    eas: '0x4200000000000000000000000000000000000021',
    schemaRegistry: '0x4200000000000000000000000000000000000020',
  },
  11155420: {
    eas: '0xE132c2E90274B44FfD8090b58399D04ddc060AE1',
    schemaRegistry: '0x6dd0CB3C3711c8B5d03b3790e5339Bbc2Bbcf934',
  },
};

export const chainNameToId: { [chainName: string]: number } = {
  ethereum: 1,
  sepolia: 11155111,
  optimism: 10,
  'optimism-sepolia': 11155420,
  base: 8453,
  'base=sepolia': 84532,
};

export const schemaFieldTypes = [
  'address',
  'string',
  'bool',
  'bytes32',
  'bytes',
  'uint8',
  'uint32',
  'uint64',
  'uint128',
  'uint256',
];
