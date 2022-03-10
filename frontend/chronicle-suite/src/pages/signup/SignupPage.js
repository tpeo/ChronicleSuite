import { createStyles, Container, Center, Group, Button, Space } from '@mantine/core';
import { useState, useEffect } from 'react';
import { LogoFacebook, LogoTwitter, LogoInstagram } from 'react-ionicons'

const useStyles = createStyles((theme, _params, getRef) => {
    return {
        // BottomContainer: {
        //     height: '20%'
        // },
        TopCenter: {
            width: '100%',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
            // alignSelf: 'center'
        },
        SocialGroup: {
            height: '80%',
            width: '80%',
            backgroundColor: 'lightgrey',
            borderRadius: '2em',
            padding: '5%'
        },
        SocialCenter: {
            // height: '80%',
            width: '100%',
            flexGrow: '1',
            flexDirection: 'column'
        },
        ButtonRoot: {
            minWidth: '300px',
        },
        ButtonInner: {
            justifyContent: 'flex-start'
        },
        BottomGroup: {
            height: '20%',
            width: '100%',
            // backgroundColor: "red",
            padding: '5%'
        },
    };
  });

export default function SignupPage(props) {
    const { classes } = useStyles()

    return (
        <>
        <Center fluid className={classes.TopCenter}>
            <Group className={classes.SocialGroup} direction="column">
                <h1>Add your social accounts to get started</h1>
                <Center className={classes.SocialCenter}>
                    <Button leftIcon={<LogoFacebook />} variant="white" size="xl" classNames={{root: classes.ButtonRoot, inner: classes.ButtonInner}}>
                        Connect to Facebook
                    </Button>
                    <Space h="md" />
                    <Button leftIcon={<LogoInstagram />} variant="white" size="xl" classNames={{root: classes.ButtonRoot, inner: classes.ButtonInner}}>
                        Connect to Instagram
                    </Button>
                    <Space h="md" />
                    <Button leftIcon={<LogoTwitter />} variant="white" size="xl" classNames={{root: classes.ButtonRoot, inner: classes.ButtonInner}}> 
                        Connect to Twitter
                    </Button>
                </Center>
            </Group>
        </Center>
        <Group className={classes.BottomGroup} position="right">
            <Button variant="subtle" color='gray'>Skip ➤</Button>
            <Button>Next</Button>
        </Group>
        </>
    );
}