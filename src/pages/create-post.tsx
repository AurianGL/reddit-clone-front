import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { InputField } from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';
import { query } from '@urql/exchange-graphcache';

const CreatePost: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [, createPost] = useCreatePostMutation();
	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ title: '', text: '' }}
				onSubmit={async values => {
					await createPost({ input: values });
						router.push('/');
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
