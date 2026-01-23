import {getMe} from "@/Api/api"
export const userDetail = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const res = await getMe();
            const user = res.data;
            return user;
        } catch (error) {
            // console.log(error.message);
            return null;
        }

    }
}
