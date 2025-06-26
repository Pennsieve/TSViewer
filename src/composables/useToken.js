import {fetchAuthSession} from "aws-amplify/auth";

export async function useToken() {
    try {
        return fetchAuthSession().then((session) => {
            console.log('session object', session)
            console.log('access token is', session?.tokens?.accessToken.toString())
            return session?.tokens?.accessToken.toString();
            }
        );
    } catch (error) {
        console.error(error);
    }
}

export async function useLogout() {
    Auth.logout()
}
