import React from 'react'
import {Flex, Spacer} from '@chakra-ui/react';
import {Link} from 'react-router-dom';

const navbar = [
    {
        name: 'Home',
        href: '/home'
    }, 
    {
        name: 'Profile',
        href: '/profile'
    },
    {
        name: 'Dashboard',
        href: '/dashboard'
    },
    {
        name: 'Resell',
        href: '/resell'
    },
    {
        name: 'Mint',
        href: '/mint'
    }
]

export default function Header() {
  return (
    <>
        <Flex style = {{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            {navbar.map((item, index) => (
                <Link
                    className = "headerlink-title"
                    to = {item.href}
                    style = {{fontSize: 24, fontWeight: 'bold'}}
                >
                    {item.name}
                </Link>
             ))}
        </Flex>
    </>
  )
}
