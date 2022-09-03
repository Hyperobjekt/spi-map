import { Button, Grid, Link } from '@mui/material';
import { useAuthApplyActionCode, useAuthSendEmailVerification } from '@react-query-firebase/auth';
import { STAGE, useIntroModalStore } from 'App/IntroModal';
import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';

const VerifyEmail = ({ auth, oobCode, continueUrl, lang }) => {
  const [setStage] = useIntroModalStore((state) => [state.setStage], shallow);

  const [componentKey, setComponentKey] = useState();
  const { mutate: applyActionCode } = useAuthApplyActionCode(auth);
  const { mutate: sendVerificationEmail } = useAuthSendEmailVerification();

  const { email } = Object.fromEntries(new URLSearchParams(continueUrl));

  const Component = {
    SUCCESS: () => <div>Yay you did it!</div>,
    ERROR_LOGGED_OUT: () => (
      <div>
        Code is invalid or expired{' '}
        <Grid container>
          <Grid item>
            <Link href="#" variant="body2" onClick={() => window.location.reload()}>
              {'Back to login'}
            </Link>
          </Grid>
        </Grid>
      </div>
    ),
    ERROR_LOGGED_IN: () => (
      <div>Code is invalid or expired. You will receive an updated validation email shortly.</div>
    ),
  }[componentKey];

  useEffect(() => {
    if (oobCode) {
      applyActionCode(oobCode, {
        onSuccess: () => {
          // Email address has been verified.
          // TODO: Display a confirmation message to the user.
          // You could also provide the user with a link back to the app.
          // TODO: If a continue URL is available, display a button which on
          // click redirects the user back to the app via continueUrl with
          // additional state determined from that URL's parameters.

          setComponentKey('SUCCESS');
        },
        onError: (error, variables, context) => {
          // Code is invalid or expired. Ask the user to verify their email address
          // again.

          if (auth.currentUser) {
            console.log(auth.currentUser);
            sendVerificationEmail({ user: auth.currentUser });
            setComponentKey('ERROR_LOGGED_IN');
          } else {
            setComponentKey('ERROR_LOGGED_OUT');
          }
        },
      });
    }
  }, [oobCode, applyActionCode, sendVerificationEmail]);

  if (!Component) return null;

  return <Component />;
};

export default VerifyEmail;
