require("dotenv").config();

const { hexToU8a, isHex } = require("@polkadot/util");
const { decodeAddress, encodeAddress } = require("@polkadot/keyring");

const isValidAddressPolkadotAddress = address => {
  try {
    encodeAddress(
      isHex(address) ? hexToU8a(address) : decodeAddress(address, false, 42)
    );

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { checkBalance, isValidAddressPolkadotAddress };
