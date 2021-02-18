import { BehaviorSubject } from "rxjs"

export const tokenSubject = function () {
    const subject = new BehaviorSubject<string | null>(null);
    const isAuthenticated = () => subject.value !== null;
    return {
        subject,
        isAuthenticated,
        parseToken: () => isAuthenticated() ? subject.value : null, // TODO: Should parse JWT token and return info - presumably with companyId
        tryLogin: () => subject.next('blabla') // TODO: This will attempt to get auth cookie?
    }
}()