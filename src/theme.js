import React, {useEffect, useState} from 'react';
import {ethers, BigNumber} from 'ethers';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
// import CoinABI from './ABI/CoinABI.json';
// import Home from './views/Home';
// import Profile from './views/Profile';
// import Mint from './views/Mint';
// import Header from './layout/Header';
// import Dashboard from './views/Dashboard';
// import Resell from './views/Resell';


const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const theme = extendTheme({ config })

export default theme

