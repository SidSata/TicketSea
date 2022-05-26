import React from 'react'
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
  } from "@chakra-ui/react";


export default function CardComponent(props) {
    console.log(props.data.image);
  return (
    <Container>
    <Box
    maxW="sm"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    >
<Image src={props.data.image} objectFit='cover' boxSize = '320' />

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
</Box>
</Box>
</Box>
  </Container>
  );
}
