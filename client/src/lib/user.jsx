import { getMe } from "@/Api/api"
export const userDetail = async () => {
    try {
        const res = await getMe();
        return res.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}
