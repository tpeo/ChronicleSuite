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
  createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { reduce } from 'rxjs';
import { Link } from 'react-router-dom';

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
    const form = useForm({
      initialValues: {
        email: '',
        password: '',
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

    const handleSubmit = (values: typeof form.values) => {
      console.log(values)
    };

    const login = () => {
    };

    return (
      <>
        <Container className={classes.LogoContainer} fluid>
          <Image src='images/logo.svg'></Image>
        </Container>

        <Container size={420} my={50} p="l" >
          <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
              <TextInput 
                label="Email" 
                placeholder="example@gmail.com" 
                size="md"
                {...form.getInputProps('email')}
              />
              <PasswordInput 
                label="Password" 
                placeholder="Your password" 
                mt="md" 
                size="md"
                {...form.getInputProps('password')}
              />

              <Group position="apart" mt="md">
                <Checkbox label="Remember me" />
                <Anchor onClick={(event) => event.preventDefault()} href="#" size="sm">
                  Forgot password?
                </Anchor>
              </Group>

              <Button type="submit" fullWidth mt="xl" size="md" onClick={login}>
                Login
              </Button>

              <Text align="center" mt="md">
                Don&apos;t have an account?{' '}
                <Anchor href="#" weight={700} onClick={(event) => event.preventDefault()}>
                  Register
                </Anchor>
              </Text>
          </form>
        </Container>
      </>
    ) 
}

export default LoginPage