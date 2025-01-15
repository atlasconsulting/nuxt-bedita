import { type H3Event, useSession } from 'h3';

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    const event: H3Event = useRequestEvent() as H3Event;
    const currentProject = useState('currentProject', () => '');
    const session = await useSession(event, getSessionConfig(event));
    if (session.data?._project) {
      currentProject.value = session.data._project;
    }
  }
});
