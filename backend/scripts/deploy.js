async function main() {
  [owner, signer2, signer3] = await ethers.getSigners();

  OceanLokiCoin = await ethers.getContractFactory("OceanLokiCoin", owner);
  oceanLokiCoin = await OceanLokiCoin.deploy();

  Crowdsale = await ethers.getContractFactory("Crowdsale", owner);
  crowdSale = await Crowdsale.deploy(2, owner.address, oceanLokiCoin.address);

  await oceanLokiCoin.connect(owner).mint(crowdSale.address, ethers.utils.parseEther("10000"));

  console.log("Crowdsale:", crowdSale.address);
  console.log("OceanLokiCoin:", oceanLokiCoin.address);
  // console.log("signer2:", signer2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
