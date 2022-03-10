import { createStyles, Global, AppShell, Navbar, Header, Container, Group, Grid, Image } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { FLEXCEL_PAGE_NAME } from '../../constants';

const useStyles = createStyles((theme, _params, getRef) => {
    return {
        Header: {
            backgroundColor: 'black'
        },
        LogoWrapper: {
            padding: '15px'
        },
        AppShellMain: {
            minHeight: 'calc(100vh - 70px)',
            display: 'flex',
            flexDirection: 'column'
        }
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
                classNames={{
                    // root: 'your-root-class',
                    // body: 'your-body-class',
                    main: classes.AppShellMain,
                  }}
            >
                <Outlet></Outlet>
            </AppShell>
        </>

    );
}