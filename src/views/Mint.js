import React from "react";
import {
  Flex,
  Input,
  FileUpload,
  Button,
  Text,
  Container,
  Textarea,
  Spacer,
  Image,
  Badge,
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";
import { Icon } from '@chakra-ui/react'
import {ethers} from 'ethers';
// import { FiFile } from "react-icons/fi";

import NFTMarketplace from "../ABI/NFTMarketplace.json";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function Mint() {
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  
  // const router = useRouter();

  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function uploadToIPFS() {
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    console.log(price);
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const ethprice = ethers.utils.parseUnits(price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, ethprice, { value: listingPrice })
    await transaction.wait()
  }

  return (
    <VStack>
      <Container maxW="7xl">
        <Text fontSize="3xl" fontWeight="bold">
          Name
        </Text>
        <Input
          placeholder="Here is a sample placeholder"
          onChange={(e) => setName(e.target.value)}
        />
        <Text fontSize="3xl" fontWeight="bold">
          Description
        </Text>
        <Textarea
          placeholder="Here is a sample placeholder"
          onChange={(e) => setDescription(e.target.value)}
        />
      </Container>
      <Container maxW="7xl">
        <FormControl>
          <FormLabel htmlFor="price" fontSize="3xl" fontWeight="bold">
            Asset Price in ETH{" "}
          </FormLabel>
          <NumberInput>
            <NumberInputField
              id="price"
              onChange={(e) => setPrice(e.target.value)}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Container>
      <Container maxW="7xl">
        <Text fontSize="3xl" fontWeight="bold">
          Ticket
        </Text>
        <input type = "file" onChange = {onChange}/>
        {
          fileUrl && (
            <Image width = "360" height = "360"  src={fileUrl} />
          )
        }
      </Container>
      <Button colorScheme="teal" variant="solid" onClick = {listNFTForSale}>
        Create NFT
      </Button>
    </VStack>
  );
}
