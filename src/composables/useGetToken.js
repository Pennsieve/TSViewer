import testAuthKey from '../constants/auth.js'

export async function useGetToken() {
        return testAuthKey
}

export async function useLogout() {
    Auth.logout()
}
