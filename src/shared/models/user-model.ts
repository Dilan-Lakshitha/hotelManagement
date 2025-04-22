export interface UserModel {
    userInfo:Users | null;
    loading: boolean;
    error: string | undefined;
    success: boolean;
    user:Users[];
}
export interface Users {
    agency_id: number;
    agency_name : string;
    agency_email : string;
    password : string;
}