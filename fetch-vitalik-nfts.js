import { Network, Alchemy } from 'alchemy-sdk';

// Configure Alchemy settings
const settings = {
  apiKey: "e7j15ydS0dxsmFpt9TvuRczuwbu7VA4v",
  network: Network.ETH_MAINNET,
};

// Create an Alchemy instance
const alchemy = new Alchemy(settings);

async function fetchVitalikNFTs() {
  try {
    // Get all NFTs owned by vitalik.eth
    console.log("Fetching NFTs for vitalik.eth...");
    const nfts = await alchemy.nft.getNftsForOwner("vitalik.eth");
    
    // Print the total count
    console.log(`Total NFTs owned by vitalik.eth: ${nfts.totalCount}`);
    
    // Print information about each NFT
    console.log("\nNFT Details:");
    nfts.ownedNfts.forEach((nft, index) => {
      console.log(`\n[${index + 1}] ${nft.title || 'Unnamed NFT'}`);
      console.log(`   Contract: ${nft.contract.address}`);
      console.log(`   Token ID: ${nft.tokenId}`);
      console.log(`   Token Type: ${nft.tokenType}`);
      console.log(`   Balance: ${nft.balance}`);
      
      if (nft.media && nft.media.length > 0) {
        console.log(`   Media URL: ${nft.media[0].gateway || 'Not available'}`);
      }
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }
}

// Execute the function
fetchVitalikNFTs();