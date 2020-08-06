import useSWR from 'swr';
import fetcher from './fetch';

export function useCurrentUser() {
  const { data, mutate } = useSWR('/api/user', fetcher);
  const user = data?.user;
  return [user, { mutate }];
}

export function useUser(id) {
  const { data } = useSWR(`/api/users/${id}`, fetcher, { revalidateOnFocus: false });
  return data?.user;
}

export function useUsers() {
  const { data } = useSWR('/api/users', fetcher);
  return data?.users;
}
