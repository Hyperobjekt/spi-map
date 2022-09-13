const { Box } = require('@mui/material');
const { Form: FormikForm } = require('formik');

const Form = ({ children, ...props }) => {
  return (
    <Box
      component={FormikForm}
      sx={{
        mt: 2,
        mb: 1,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Form;
