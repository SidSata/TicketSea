import React from "react";
import {useState, useRef, useEffect} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Input,
  FormLabel,
  Button,
  Box,
  ModalFooter,
  Container,
  Image,
  useDisclosure
} from "@chakra-ui/react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal';

import NFTMarketplace from '../ABI/NFTMarketplace.json'
import {
    marketplaceAddress
  } from '../config'

export default function ResellModalComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef();
  const [price, setPrice] = useState(props.data.price);
  const tokenURI = props.data.tokenId;
  const finalRef = React.useRef();

  async function listNFTForSale() {
    if (!price) return
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const priceFormatted = ethers.utils.parseUnits(price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await contract.resellToken(tokenURI, priceFormatted, { value: listingPrice })
    await transaction.wait()
    window.location.reload();
  }

  return (
    <Container>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Image src={props.data.image} objectFit = 'cover' boxSize = '320'/>
        <Box p="6">
          <Box display="flex" alignItems="baseline">
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {props.data.description}
            </Box>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {props.data.name}
          </Box>

          <Box>
            {props.data.price}
            <Box as="span" color="gray.600" fontSize="sm">
              ETH
            </Box>
            <Box display="flex" mt="2" alignItems="center">
            <Button onClick={onOpen}>Resell</Button>        
            </Box>
  
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Resell your Ticket!</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>New Price</FormLabel>
                <Input ref={initialRef} placeholder= {props.data.price} onChange = {(e) => setPrice(e.target.value)}/>
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='green' mr={3} onClick = {listNFTForSale}>
                Resell
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
