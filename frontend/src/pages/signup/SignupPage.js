import { Button, Center, createStyles, Group, Space, Step, Stepper, Paper , Container, Text, Stack, TextInput, Popover, Progress, Box} from "@mantine/core";
import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare } from "react-icons/fa";
import { IconUserCheck, IconMailOpened, IconSocial, IconCircleCheck, IconAt, IconLock, IconCheck, IconX, IconShieldCheck } from '@tabler/icons';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useNavigate } from "react-router-dom";
import { facebookAccountService } from "../../_services/facebook.account.service";
import fetchUserID from "../../_services/GetMetaData";

const useStyles = createStyles((theme, _params, getRef) => {
	return {
		wrapper: {
			minHeight: 900,
			padding: 100,
		},
		TopCenter: {
			width: "100%",
			height: "80%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			// alignSelf: 'center'
		},
		ButtonRoot: {
			minWidth: "300px",
		},
		ButtonInner: {
			justifyContent: "flex-start",
		},
		BottomGroup: {
			height: "20%",
			width: "100%",
			// backgroundColor: "red",
			padding: "5%",
		},
	};
});

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
	return (
		<Text
			color={meets ? 'teal' : 'red'}
			sx={{ display: 'flex', alignItems: 'center' }}
			mt={7}
			size="sm"
		>
			{meets ? <IconCheck size={14} /> : <IconX size={14} />} <Box ml={10}>{label}</Box>
		</Text>
	);
}

const requirementsPw = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrengthPw(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;
  
	requirementsPw.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}	
	});
	return Math.max(100 - (100 / (requirementsPw.length + 1)) * multiplier, 10);
}


export default function SignupPage(props) {
	const { classes } = useStyles();
	const navigate = useNavigate();
	
	const [active, setActive] = useState(0);
	const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
	const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

	// popover checks for creating a password
	const [popoverOpenedPw, setPopoverOpenedPw] = useState(false);
	const [valuePw, setValuePw] = useState('');
	const checksPw = requirementsPw.map((requirement, index) => (
		<PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(valuePw)} />
	));
	const strengthPw = getStrengthPw(valuePw);
  	const colorPw = strengthPw === 100 ? 'teal' : strengthPw > 50 ? 'yellow' : 'red';

	// universal form for all steps
	const form = useForm({
		initialValues: {
			email: '',
			password: '',
			passwordConfirm: '',
			terms: true,
		},
	
		validate: {
			email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
			password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
			passwordConfirm: (value, values) =>
				value !== values.password ? 'Passwords do not match' : null,
		},
	});

	const handleError = (errors: typeof form.errors) => {
		if (active === 0) {
			if (errors.email) {
				showNotification({ autoClose: 3000, message: 'Please provide a valid email', color: 'red' });
			} else if (errors.passwordConfirm) {}
		}
		
	};

	// creating an account steps
	const handleSubmit = (values: typeof form.values) => {
		console.log(values);
		switch (active) {
			case 0:
				nextStep();
				break;
			
			case 1:
				break;
			
			case 2:
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
				<Stepper.Step label="First step" description="Create an account" icon={<IconUserCheck size={18} />}/>
				<Stepper.Step label="Second step" description="Verify email" icon={<IconMailOpened size={18} />}/>
				<Stepper.Step label="Final step" description="Get full access" icon={<IconSocial size={18}/>}/>
			</Stepper>

			<form onSubmit={form.onSubmit(handleSubmit, handleError)}>
				<Paper radius="md" p="xl" mt="xl" shadow="xs" withBorder {...props}>
					<Stack>
						{active == 0 && (
							<>
								{/* create an account stuff */}
								<TextInput
									required
									label="Email" 
									placeholder="example@gmail.com" 
									size="md"
									icon={<IconAt size={16} />}
									{...form.getInputProps('email')}
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
										{...form.getInputProps('password')}
									/>	
									<TextInput
										required
										type="password" 
										label="Confirm Password" 
										placeholder="Your password" 
										mt="md" 
										size="md"
										icon={<IconLock size={16} />}
										{...form.getInputProps('passwordConfirm')}
									/>
								</Group>
							</>
						)}

						{active == 1 && (
							<>
								<Text size="lg" weight={500}>
									Please verify your email
								</Text>
								{/* some icon for email verification */}
								<TextInput
									required
									type="password" 
									label="Enter code" 
									placeholder="Your code" 
									mt="md" 
									size="md"
									icon={<IconShieldCheck size={16} />}
									{...form.getInputProps('verifyEmail')}
								/>
							</>
						)}

						{active == 2 && (
							<>
								<Text size="lg" weight={500}>
									Add your social accounts to get started!
								</Text>
								<Button
									onClick={facebookAccountService.login}
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
								<Button leftIcon={<FaTwitterSquare />} variant="white" size="xl" classNames={{ root: classes.ButtonRoot, inner: classes.ButtonInner }}>
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
					<Button type="submit" >
						{active === 2 && (
							<Text>Create Account</Text>
						)}
						{active !== 2 && (
							<Text>Next</Text>
						)}
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
