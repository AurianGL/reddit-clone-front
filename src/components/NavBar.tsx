import { Box, Button, Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	let body = null;

	if (fetching) {
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href='/login'>
					<Link color='white' mr={2}>
						login
					</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link color='white'>register</Link>
				</NextLink>
			</>
		);
	} else {
		body = (
			<Flex>
				<Box mr={2} color='white'>
					{data.me.username}
				</Box>
				<Button
					isLoading={logoutFetching}
					onClick={() => {
						logout();
					}}
					variant='link'
					color='white'>
					logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex bg='teal.500' p={4}>
			<Box ml={'auto'}>{body}</Box>
		</Flex>
	);
};
