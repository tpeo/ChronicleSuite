import { createStyles, Global, AppShell, Navbar, Header, Container, Group, Grid, Image } from '@mantine/core';
import { Outlet } from 'react-router-dom';

const useStyles = createStyles((theme, _params, getRef) => {
    return {
        Header: {
            backgroundColor: 'black'
        },
        LogoWrapper: {
            padding: '15px'
        },
    };
  });

export default function DefaultLayout(props) {
    const { classes } = useStyles()

    const HeaderContent = <>
        <Group>
            <Image classNames={{imageWrapper: classes.LogoWrapper, image: classes.LogoImage}} height={40} src='images/logo.svg'></Image>
        </Group>
    </>

    return (
        <>
            <AppShell 
                header={<Header height={70} className={classes.Header}>{HeaderContent}</Header>}
            >
                <Outlet></Outlet>
            </AppShell>
        </>

    );
}