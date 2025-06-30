import {fetchAuthSession} from "aws-amplify/auth";

export async function useToken() {
    try {
        return fetchAuthSession().then((session) => {
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
