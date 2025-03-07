const hre = require("hardhat");

async function main() {
    const Contract = await hre.ethers.getContractFactory("BloodBank");
    const contract = await Contract.deploy();

    await contract.waitForDeployment();
    console.log(`Contract deployed to: ${contract.target}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
