import { Anchor, Button, Checkbox, createStyles, Group, Loader, Paper, Stack, Stepper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconCircleCheck, IconLock, IconMailOpened, IconShieldCheck, IconSocial, IconUserCheck } from "@tabler/icons";
import { useState } from "react";
import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useOAuth from "../../_helpers/useOAuth";
import { facebookAccountService } from "../../_services/facebook.account.service";
import env from "../../env";

const useStyles = createStyles((theme, _params, getRef) => {
	return {
		wrapper: {
			minHeight: 900,
			padding: 100,
		},
	};
});

export default function SignupPage(props) {
	const metaOAuth = useOAuth({
		authorizeUrl: "https://www.facebook.com/v15.0/dialog/oauth",
		clientId: env.REACT_APP_FACEBOOK_APP_ID,
		redirectUri: "https://localhost:3000/callback",
		scope: "",
	});
	const { classes } = useStyles();
	const navigate = useNavigate();
	const [visible, setVisible] = useState(false); // for loading screen between create acc and dashboard pages

	const [active, setActive] = useState(0);
	const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
	const prevStep = () => {
		if (active === 0) {
			navigate("/login");
		} else {
			if (active !== 0) {
				form.setFieldValue("verifyCode", "");
				setSendingLink(false);
			}
			setActive((current) => (current > 0 ? current - 1 : current));
		}
	};

	// reset link
	const [sendingLink, setSendingLink] = useState(false);
	const sendLink = () => {
		// TODO: stuff to actually send the email
		setSendingLink(true);
	};
	const setSendLinkWidth = () => {
		return sendingLink ? 30 : 100;
	};

	// universal form for all steps
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: "",
			terms: false,
			verifyCode: "",
		},

		validate: {
			email: (val) => (/^\S+@\S+$/.test(val) ? null : "     "),
			password: (val) => (val.length < 6 ? "Password should include at least 6 characters" : null),
			passwordConfirm: (value, values) => (value !== values.password ? "   " : null),
			terms: (val) => (val ? null : "    "),
		},
	});

	const handleError = (errors) => {
		if (active === 0) {
			if (errors.email) {
				showNotification({ autoClose: 3000, message: "Please provide a valid email", color: "red" });
			} else if (errors.passwordConfirm) {
				showNotification({ autoClose: 3000, message: "Passwords do not match", color: "red" });
			} else if (errors.terms) {
				showNotification({ autoClose: 3000, message: "Please accept the terms and conditions", color: "red" });
			}
		}
	};

	// creating an account steps
	const handleSubmit = (values) => {
		console.log(values);
		console.log(active);
		switch (active) {
			case 0:
				nextStep();
				break;

			case 1:
				// verify email
				nextStep();
				break;

			case 2:
				// create account and go to dashboard so loading screen
				console.log("helloo???");
				setVisible((v) => !v);
				break;

			default:
		}
		// setVisible((v) => !v); // loading !!! thing
	};

	return (
		<div className={classes.wrapper}>
			{/* TODO: add a banner at top with site name */}
			<Text size="lg" weight={500}>
				Welcome to Chonicle Suite!
			</Text>
			<Stepper active={active} onStepClick={setActive} completedIcon={<IconCircleCheck />} breakpoint="sm" mt="md">
				<Stepper.Step label="First step" description="Create an account" icon={<IconUserCheck size={18} />} />
				<Stepper.Step label="Second step" description="Verify email" icon={<IconMailOpened size={18} />} />
				<Stepper.Step label="Final step" description="Connect socials" icon={<IconSocial size={18} />} />
			</Stepper>

			<form onSubmit={form.onSubmit(handleSubmit, handleError)}>
				<Paper radius="md" p="xl" mt="xl" shadow="xs" withBorder {...props}>
					<Stack>
						{active === 0 && (
							<>
								{/* create an account stuff */}
								<Text size="l" weight={500}>
									Create your Chronicle Suite account
								</Text>
								<TextInput
									required
									label="Email"
									placeholder="example@gmail.com"
									size="md"
									icon={<IconAt size={16} />}
									{...form.getInputProps("email")}
								/>
								<Group>
									<TextInput
										required
										type="password"
										label="Password"
										placeholder="Your password"
										mt="md"
										size="md"
										icon={<IconLock size={16} />}
										{...form.getInputProps("password")}
									/>
									<TextInput
										required
										type="password"
										label="Confirm Password"
										placeholder="Your password"
										mt="md"
										size="md"
										icon={<IconLock size={16} />}
										{...form.getInputProps("passwordConfirm")}
									/>
								</Group>
								<Checkbox
									label="I accept terms and conditions"
									checked={form.values.terms}
									onChange={(event) => form.setFieldValue("terms", event.currentTarget.checked)}
								/>
							</>
						)}

						{active === 1 && (
							<>
								<Text size="l" weight={500}>
									Please verify your email
								</Text>
								{/* some icon for email verification */}
								<TextInput
									required
									type="password"
									label="Enter code"
									placeholder="Your code"
									mt="xs"
									size="md"
									icon={<IconShieldCheck size={16} />}
									rightSectionWidth={setSendLinkWidth()}
									rightSection={
										(sendingLink && <Loader size="xs" />) || (
											<Anchor component="button" type="button" color="dimmed" onClick={() => sendLink()} size="xs">
												Resend link?
											</Anchor>
										)
									}
									{...form.getInputProps("verifyCode")}
								/>
							</>
						)}

						{active === 2 && (
							<>
								<Text size="lg" weight={500}>
									Add your social accounts to get started!
								</Text>
								<Button
									// onClick={facebookAccountService.login}
									onClick={metaOAuth}
									leftIcon={<FaFacebookSquare />}
									variant="white"
									size="xl"
									classNames={{ root: classes.ButtonRoot, inner: classes.ButtonInner }}
								>
									Connect to Facebook
								</Button>

								<Button
									leftIcon={<FaInstagramSquare />}
									variant="white"
									size="xl"
									classNames={{ root: classes.ButtonRoot, inner: classes.ButtonInner }}
								>
									Connect to Instagram
								</Button>
								<Button
									leftIcon={<FaTwitterSquare />}
									variant="white"
									size="xl"
									classNames={{ root: classes.ButtonRoot, inner: classes.ButtonInner }}
								>
									Connect to Twitter
								</Button>
							</>
						)}
					</Stack>
				</Paper>
				<Group position="apart" mt="xl">
					<Button variant="default" onClick={prevStep}>
						<Text color="gray">Back</Text>
					</Button>
					<Button type="submit">
						{/* TODO: Add verification for form inputs */}
						{active === 0 && <Text onClick={nextStep}>Next</Text>}
						{active === 1 && <Text onClick={nextStep}>Verify Email</Text>}
						{active === 2 && <Text onClick={() => navigate("/dashboard")}>Create Account</Text>}
					</Button>
				</Group>
			</form>

			{/* <Group className={classes.BottomGroup} position="right">
				<Button variant="subtle" color="gray" onClick={() => navigate("/dashboard/overview")}>
					Skip ➤
				</Button>
				<Button onClick={() => navigate("/dashboard/overview")}>Next</Button>
			</Group> */}
		</div>
	);
}
