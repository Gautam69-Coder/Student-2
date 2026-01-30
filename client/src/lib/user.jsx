import { getMe } from "@/Api/api"
export const userDetail = async () => {
    try {
        const res = await getMe();
        return res.data;
    } catch (error) {
        return null;
    }
}
