import { Anchor, Container, Image, createStyles, TextInput, Space, Button, Group } from '@mantine/core';
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
    FormContainer: {
      height: '60%',
      paddingTop: '5%'
    },
  };
});

function LoginPage(props) {
    const { classes } = useStyles()
    return (
      <>
        <Container className={classes.LogoContainer} fluid>
          <Image src='images/logo.svg'></Image>
        </Container>
        <Container className={classes.FormContainer} size="xs">
          <form>
            <Group direction="column" align="center">
              <TextInput placeholder='email or username'></TextInput>
              <TextInput placeholder='password'></TextInput>
              <Space h="md"/>
              <Button>Login</Button>
              <Anchor component={Link} underline="true" to="/signup">
                sign up
              </Anchor>
            </Group>
          </form>
        </Container>
      </>
    ) 
}

export default LoginPage