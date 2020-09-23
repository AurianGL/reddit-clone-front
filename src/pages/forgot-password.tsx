import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useState } from 'react';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({}) => {
	const [complet, setComplete] = useState(false)
	const [, forgotPassword] = useForgotPasswordMutation()
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: ""}}
				onSubmit={async (values, { setErrors }) => {
					forgotPassword(values)
					setComplete(true)
				}}>
				{({ isSubmitting }) => complet ? <Box>if this email is associated with an account, we've sent you a email</Box> : (
					<Form>
						<InputField
							name='email'
							placeholder='email'
							label='Email'
							type='email'
						/>
						<Button
							mt={4}
							type='submit'
							isLoading={isSubmitting}
							variantColor='teal'>
							Send me a reset link
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPassword);
