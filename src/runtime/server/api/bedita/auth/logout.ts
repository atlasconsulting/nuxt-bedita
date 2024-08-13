import { setResponseStatus, defineEventHandler, useSession } from 'h3';
import { getSessionConfig } from '../../../utils/session';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, getSessionConfig());
  await session.clear();

  setResponseStatus(event, 204);
});
