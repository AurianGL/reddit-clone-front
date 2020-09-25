import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
	const router = useRouter();
	useIsAuth()
	const [, createPost] = useCreatePostMutation();
	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ title: '', text: '' }}
				onSubmit={async values => {
					const { error } = await createPost({ input: values });
					if (!error) {
						router.push('/');
					} else {
						console.log(error)
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='title' placeholder='title' label='Title' />
						<Box mt={4}>
							<InputField
								textarea
								name='text'
								placeholder='text...'
								label='Content'
							/>
						</Box>
						<Button
							mt={4}
							type='submit'
							isLoading={isSubmitting}
							variantColor='teal'>
							create post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
