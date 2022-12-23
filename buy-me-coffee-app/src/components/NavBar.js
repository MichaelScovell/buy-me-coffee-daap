// NavBar Component
import React from "react";
import {Box, Button, Flex, Image, Link} from "@chakra-ui/react";
import Twitter from "../assets/twitter_32x32.png";

const NavBar = ({ accounts, setAccounts}) => {
    // Defining boolean to detect whether there is a connected account
    const isConnected = Boolean(accounts[0]);

    async function connectAccount() {
        // Connecting an account from metamask
        // Retrieving the accounts and setting the account
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccounts(accounts)
        }
    }

    return (
        <Flex justify="space-between" align="center" padding="30px">
            {/* Social Links */}
            <Flex justify="space-between" width="40%" padding="0 75px">
                <Link href="https://twitter.com/home" target="_blank">
                    <Image src={Twitter} boxsize="42px" margin="0 15px"/>
                </Link>                                
            </Flex>

            {/* Menu Items*/}
            <Flex justify="space-around" algin="center" width="40%" padding="30px">
            {/* Connections - show tag when connected and button when not */}
            {isConnected ?(
                <Box margin="0 15px">Connected</Box>
            ): (
                <Button 
                backgroundColor="#bf8040"
                borderRadius="5px"
                boxShadow="0px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="0 15px"
                onClick={connectAccount}>Connect</Button>
            )}                
            </Flex>
        </Flex>
    )
};

export default NavBar;