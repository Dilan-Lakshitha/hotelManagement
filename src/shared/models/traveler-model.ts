export interface travelerModel {
    loading: boolean;
    error: string | undefined;
    success: boolean;
    traveler:traveler[];
}
export interface traveler {
    group_id: number;
    agency_id:number;
    name: string;
    passport_number: string;
    nationality: string;
    phone:string;
    email:string;
    date_of_birth: Date;
    traveler_id:number;
    traveler_type:string;
    group:group;
}

export interface group {
    group_id: number;
    number_adults: number;
    number_child: number;
    notes:string;
}