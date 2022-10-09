import { createStyles, Global, AppShell, Navbar, Header, Container, Group, Grid, Image, Tabs } from "@mantine/core";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const useStyles = createStyles((theme, _params, getRef) => {
	return {
		Header: {
			backgroundColor: "black",
		},
		LogoWrapper: {
			padding: "15px",
		},
		AppShellMain: {
			minHeight: "calc(100vh - 70px)",
			display: "flex",
			flexDirection: "column",
			padding: "0",
		},
		TabsListWrapper: {
			padding: "10px 10px 0",
		},
		TabContent: {
			margin: "20px",
		},
	};
});

export default function DefaultLayout(props) {
	const [activeTab, setActiveTab] = useState("overview");

	const { classes } = useStyles();
	const navigate = useNavigate();

	function onChange(active) {
		const validTabs = ["overview", "facebook", "instagram", "twitter"];
		if (!validTabs.includes(active)) return alert("error with tab navigation");
		setActiveTab(active);
		navigate(active);
		// switch (active) {
		// 	case 0:
		// 		navigate("overview");
		// 		break;
		// 	case 1:
		// 		navigate("facebook");
		// 		break;
		// 	case 2:
		// 		navigate("instagram");
		// 		break;
		// 	case 3:
		// 		navigate("twitter");
		// 		break;
		// 	default:
		// 		alert("error with tab navigation");
		// 		break;
		// }
	}

	const HeaderContent = (
		<>
			<Group>
				<Image classNames={{ imageWrapper: classes.LogoWrapper, image: classes.LogoImage }} height={40} src="images/logo.svg"></Image>
			</Group>
		</>
	);

	return (
		<>
			<AppShell
				padding="md"
				// header={
				// 	<Header height={70} className={classes.Header}>
				// 		{HeaderContent}
				// 	</Header>
				// }
				classNames={{
					// root: 'your-root-class',
					// body: 'your-body-class',
					main: classes.AppShellMain,
				}}
			>
				{props.tabs ? (
					<Tabs defaultValue="overview" tabPadding="md" value={activeTab} onTabChange={onChange} className={classes.TabsListWrapper}>
						<Tabs.List>
							<Tabs.Tab value="overview">Overview</Tabs.Tab>
							<Tabs.Tab value="facebook">Facebook</Tabs.Tab>
							<Tabs.Tab value="instagram">Instagram</Tabs.Tab>
							<Tabs.Tab value="twitter">Twitter</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="overview">
							<Outlet />
						</Tabs.Panel>
						<Tabs.Panel value="facebook">
							<Outlet />
						</Tabs.Panel>
						<Tabs.Panel value="instagram">
							<Outlet />
						</Tabs.Panel>
						<Tabs.Panel value="twitter">
							<Outlet />
						</Tabs.Panel>
					</Tabs>
				) : (
					<Outlet />
				)}
			</AppShell>
		</>
	);
}
