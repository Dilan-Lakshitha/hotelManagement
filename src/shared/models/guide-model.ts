export interface guideModel {
    loading: boolean;
    error: string | undefined;
    success: boolean;
    guide:guide[];
}
export interface guide {
    guideId: number;
    agencyId:number;
    Name: string;
    speakingLanguages: string;
    pricePerDay: number;
    phone:string;
    email:string;
    licenseNumber:string;
    yearOfExperience:number;
    isAvailable:boolean;
    notes:string;
}