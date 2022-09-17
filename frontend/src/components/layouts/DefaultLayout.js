import { createStyles, Global, AppShell, Navbar, Header, Container, Group, Grid, Image, Tabs } from '@mantine/core';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';


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
            flexDirection: 'column',
            padding: '0'
        },
        TabsListWrapper: {
            padding: "10px 10px 0"
        }
    };
  });

export default function DefaultLayout(props) {
    const [activeTab, setActiveTab] = useState(0);

    const { classes } = useStyles()
    const navigate = useNavigate()

    function onChange(active) {
        setActiveTab(active);
        switch(active) {
            case 0:
                navigate("overview")
                break
            case 1:
                navigate("facebook")
                break
            case 2:
                navigate("instagram")
                break
            case 3:
                navigate("twitter")
                break
            default:
                alert('error with tab navigation')
                break
        }
    };

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
                {
                    props.tabs ? 
                    <Tabs tabPadding="md" active={activeTab} onTabChange={onChange} classNames={{tabsListWrapper: classes.TabsListWrapper}}>
                        <Tabs.Tab label='Overview'>
                            <Outlet></Outlet>
                        </Tabs.Tab>
                        <Tabs.Tab label='Facebook'>
                            <Outlet></Outlet>
                        </Tabs.Tab>
                        <Tabs.Tab label='Instagram'>
                            <Outlet></Outlet>
                        </Tabs.Tab>
                        <Tabs.Tab label='Twitter'>
                            <Outlet></Outlet>
                        </Tabs.Tab>
                    </Tabs>
                    :
                    <Outlet></Outlet>
                }

            </AppShell>
        </>

    );
}