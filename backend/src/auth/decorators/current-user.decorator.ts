import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoggedInUser } from '@/auth/types/logged-in-user.type';

export const CurrentUser = createParamDecorator(
    <K extends keyof LoggedInUser>(data: K | undefined, context: ExecutionContext): LoggedInUser | LoggedInUser[K] => {
        const request = context.switchToHttp().getRequest<{ user: LoggedInUser }>();
        const user = request.user;
        return data ? user[data] : user;
    },
);
