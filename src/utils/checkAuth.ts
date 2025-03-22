import { auth } from '@/../auth';

export default async function checkAuth() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email;

  return { userId, email };
}
