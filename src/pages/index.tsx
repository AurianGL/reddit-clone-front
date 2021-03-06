import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Heading, Link, Stack, Text, Box, Flex, Button } from '@chakra-ui/core';
import NextLink from 'next/link';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: "" as string,
	});
	const [{ data, fetching }] = usePostsQuery({variables,});
	return (
		<Layout>
			<Flex>
				<Heading>CLRT</Heading>
				<NextLink href='/create-post'>
					<Link ml='auto'>create post</Link>
				</NextLink>
			</Flex>
			<br />
			{!data && fetching ? (
				<div>loading...</div>
			) : (
				<Stack spacing={8}>
					{data!.posts.map(p => (
						<Box key={p.id} p={5} shadow='md' borderWidth='1px'>
							<Heading fontSize='xl'>{p.title}</Heading>
							<Text mt={4}>{p.textSnippet}...</Text>
						</Box>
					))}
				</Stack>
			)}
			{data && (
				<Flex>
					<Button
						onClick={() => {
							setVariables({
								limit: variables.limit,
								cursor: data.posts[data.posts.length - 1].createdAt,
							});
						}}
						isLoading={fetching}
						m='auto'
						my={4}
						variantColor='teal'>
						load more
					</Button>
				</Flex>
			)}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
