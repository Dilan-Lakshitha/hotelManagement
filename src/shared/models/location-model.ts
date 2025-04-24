export interface locationModel {
    loading: boolean;
    error: string | undefined;
    success: boolean;
    location:location[];
}
export interface location {
    location_ticket_id: number;
    agency_id:number;
    description: string;
    location_name: string;
    adult_price: number;
    child_price:number;
}