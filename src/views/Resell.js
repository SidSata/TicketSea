import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {Flex, VStack, SimpleGrid, Spacer, HStack, Text, Grid, Image, Badge, Box, Container} from '@chakra-ui/react';

import {
  marketplaceAddress
} from '../config'

import CardComponent from '../components/CardComponent';
import ResellModalComponent from '../components/ResellModalComponent';
import NFTMarketplace from '../ABI/NFTMarketplace.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await contract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId)
        const metaRequest = await fetch(tokenURI)
        const meta = await metaRequest.json()
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      }
      return item
    }))

    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
  return (
    <VStack spacing = {4}>
      <Container maxW = "10xl">
        <Text fontSize = '6xl' fontWeight = 'bold'>
          NFTs Listed
        </Text>
      </Container>
      <Container maxW = "6xl">
      <SimpleGrid columns={[2, null, 3]} spacing="40px">
      {
            nfts.map((item, i) => (
              <ResellModalComponent data = {item} key={i} />
            ))
          }
  </SimpleGrid>
    </Container>
    </VStack>
  )
}