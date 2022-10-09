import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Text,
  Container,
  Group,
  Button,
  Image,
  Divider,
  createStyles,
  LoadingOverlay,
  Modal,
  Loader,
} from '@mantine/core';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { reduce } from 'rxjs';
import { Link , useNavigate} from 'react-router-dom';
import { IconLock, IconAt } from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    LogoContainer: {
      height: "40%",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: 'black',
      paddingBottom: '5%'
    },
  };
});

function LoginPage(props) {
    const { classes } = useStyles()
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false); // for loading screen between login and dashboard pages
    const [opened, setOpened] = useState(false); // for forget password modal

    const formForget = useForm({
      initialValues: {
        email: '',
      },

      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      },
    });

    // TODO: handle sending a link to given email
    const handleSubmitForget = (values: typeof form.values) => {
      console.log(values);
    };

    const onClosedForget = () => {
      // reset all values for forget pw module
      setOpened(false);
      formForget.reset();
    };

    const form = useForm({
      initialValues: {
        email: '',
        password: '',
        rememberMe: false,
      },
  
      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        password: (value) => (value.length == 0 ? 'Password should not be empty' : null),
    }});

    const handleError = (errors: typeof form.errors) => {
      if (errors.email) {
        showNotification({ autoClose: 3000, message: 'Please provide a valid email', color: 'red' });
      }
    };

    // TODO: login functionality
    const handleSubmit = (values: typeof form.values) => {
      console.log(values);
      // setVisible((v) => !v); // loading !!! thing
      navigate('/dashboard/overview'); // temporary until implement auth
    };

    const onRegister = () => {
      navigate('/signup');
    };

    return (
      <>
        {/* forget password modal TODO: make it prettier spacing is weird, dunno how to get notifs on top of modal*/}
        <Modal 
          centered
          size="md"
          opened={opened}
          onClose={() => onClosedForget()}
          title="Someone is locked out..." 
        >
          <form onSubmit={formForget.onSubmit(handleSubmitForget)}>
            <TextInput 
              label="Your email" 
              placeholder="example@gmail.com" 
              description="Enter your email to get a reset link"
              size="sm"
              icon={<IconAt size={16} />}
              {...formForget.getInputProps('email')}
            />

            <Button type="submit" fullWidth mt="xl" size="md">Send Link</Button>

            <Divider label="OR" labelPosition="center" my="lg" />

            <Text align="center" mt="md">
              <Anchor weight={600} color="dimmed" component={Link} to="/signup">
                Create New Account
              </Anchor>
            </Text>
          </form>
        </Modal>

        {/* login page things */}
        <LoadingOverlay visible={visible} overlayblur={2} />

        <Container className={classes.LogoContainer} fluid>
          <Image src='images/logo.svg'></Image>
        </Container>

        <Container size={420} my={50} p="l" >
          <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
              <TextInput 
                label="Email" 
                placeholder="example@gmail.com" 
                size="md"
                icon={<IconAt size={16} />}
                {...form.getInputProps('email')}
              />
              <PasswordInput 
                label="Password" 
                placeholder="Your password" 
                mt="md" 
                size="md"
                icon={<IconLock size={16} />}
                {...form.getInputProps('password')}
              />

              <Group position="apart" mt="md">
                <Checkbox label="Remember me" />
                <Anchor onClick={() => setOpened(true)} size="sm">
                  Forgot password?
                </Anchor>
              </Group>

              <Button type="submit" fullWidth mt="xl" size="md">
                Login
              </Button>

              <Text align="center" mt="md">
                Don&apos;t have an account?{' '}
                <Anchor weight={700} component={Link} to="/signup">
                  Register
                </Anchor>
              </Text>
          </form>
        </Container>
      </>
    ) 
}

export default LoginPage