import { Button, Typography } from '@mui/material';
import { useAuthSendEmailVerification } from '@react-query-firebase/auth';
import { auth } from 'App/firebase';

const EmailVerificationSent = ({ email }) => {
  const { mutate: sendVerificationEmail } = useAuthSendEmailVerification();

  return (
    <>
      <Typography
        component="p"
        sx={{
          mt: 2,
          mb: 1,
        }}
      >
        Verification email sent to {email}. Please check your email and follow the instructions.
      </Typography>
      <Button
        onClick={() => sendVerificationEmail({ user: auth.currentUser })}
        fullWidth
        variant="contained"
        sx={{ mt: 1 }}
      >
        Resend Validation Email
      </Button>
    </>
  );
};

export default EmailVerificationSent;
