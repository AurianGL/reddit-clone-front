import { dedupExchange, Exchange, fetchExchange } from 'urql';
import {
	LogoutMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	RegisterMutation,
} from '../generated/graphql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { betterUpdateQuery } from './betterUpdateQuery';
import Router from 'next/router';

import { pipe, tap } from 'wonka';

const errorExchange: Exchange = ({ forward }) => ops$ => {
	return pipe(
		forward(ops$),
		tap(({ error }) => {
			if (error?.message.includes('not authenticated')) {
				console.log('error? :', error.message.includes('not authenticated'));
				Router.replace('/login');
			}
		})
	);
};

export const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info;
		const allFields = cache.inspectFields(entityKey)
		const fieldInfos = allFields.filter((inf) => inf.fieldName === fieldName)
		const size = fieldInfos.length
		if (size === 0) {
			return undefined
		}
		const results: string[] = []
		fieldInfos.forEach((fieldInfo) => {			
			const data = cache.resolveFieldByKey(entityKey, fieldInfo.fieldKey) as string[]
			results.push(...data)
		});
		return results
	};
};

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: {
		credentials: 'include' as const,
	},
	exchanges: [
		dedupExchange,
		cacheExchange({
			resolvers: {
				Query: {
					posts: cursorPagination(),
				}
			},
			updates: {
				Mutation: {
					logout: (_result, args, cache, info) => {
						betterUpdateQuery<LogoutMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							() => ({ me: null })
						);
					},

					login: (_result, args, cache, info) => {
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(result, query) => {
								if (result.login.errors) {
									return query;
								} else {
									return {
										me: result.login.user,
									};
								}
							}
						);
					},

					register: (_result, args, cache, info) => {
						betterUpdateQuery<RegisterMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(result, query) => {
								if (result.register.errors) {
									return query;
								} else {
									return {
										me: result.register.user,
									};
								}
							}
						);
					},
				},
			},
		}),
		errorExchange,
		ssrExchange,
		fetchExchange,
	],
});
