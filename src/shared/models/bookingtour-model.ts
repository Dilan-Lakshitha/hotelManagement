export interface bookingtourModel {
    loading: boolean;
    error: string | undefined;
    success: boolean;
    bookingtour:bookingtour[];
}
export interface bookingtour {
    booking_id: number;
    traveler_id:number;
    driver_id: number;
    guide_id: number;
    total_amount: number;
    booking_date: Date;
}