import React from "react";
import {
  Flex,
  VStack,
  SimpleGrid,
  Spacer,
  HStack,
  Text,
  Grid,
  Image,
  Badge,
  Box,
  Container,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axios } from "axios";
import {ethers} from 'ethers';
import {marketplaceAddress} from '../config';
// import {CoinABI} from '../ABI/CoinABI.json';
import NFTMarketplace from '../ABI/NFTMarketplace.json';
import CardComponent from "../components/CardComponent";
import Web3Modal from "web3modal";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    /* create a generic provider and query for unsold market items */
    // const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/");
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItems();
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        if (!tokenUri) {return;}
        const metaRequest = await fetch(tokenUri);
        const meta = await metaRequest.json();
        // const metaTestJson = await metaTest.json();
        // console.log(meta);
        // const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description
        };
        return item;
      })
    );
    setNfts(items);
    console.log(items);
    setLoading("loaded");
  };

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  return (
    <VStack spacing={4}>
      <HStack display = "flex" maxW="10xl">
        {/* <Image src="https://static.vecteezy.com/system/resources/previews/000/616/286/original/g-letters-logo-and-symbols-template-icons-vector.jpg" /> */}
        <Text fontSize="6xl" fontWeight="bold">
          TicketSea
        </Text>
      </HStack>
      <Container maxW="6xl">
      <SimpleGrid columns={[2, null, 3]} spacing="40px">
        {nfts.map((item,index) => (
          <Container>
            <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
    >
        <Image src={item.image} objectFit='cover' boxSize = '320'/>
        <Box p="6">
        <Box display="flex" alignItems="baseline">
            {/* <Badge borderRadius="full" px="2" colorScheme="teal">
            New
            </Badge> */}
            <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
            >
            {item.description}
            </Box>
        </Box>

        <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
        >
            {item.name}
        </Box>

        <Box>
            {item.price}
            <Box as="span" color="gray.600" fontSize="sm">
            ETH
            </Box>
        </Box>

        <Box display="flex" mt="2" alignItems="center">
            <Button onClick = {() => buyNft(item)}> Buy</Button>
        </Box>
        </Box>
    </Box>
          </Container>
        ))}
      </SimpleGrid>
        </Container>
      </VStack>
  );
}
