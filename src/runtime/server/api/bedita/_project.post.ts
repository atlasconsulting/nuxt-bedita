import { defineEventHandler, useSession, readBody, setResponseStatus } from 'h3';
import { getSessionConfig } from '../../utils/session';
import { createError } from '#imports';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, getSessionConfig(event));
  const body = await readBody(event);
  if (!body?.project || typeof body.project !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: '"project" must be a not empty string',
    });
  }

  await session.update({ ...session.data, _project: body.project });

  setResponseStatus(event, 204);

  return {};
});
