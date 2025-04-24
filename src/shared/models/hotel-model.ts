export interface hotelModel {
    loading: boolean;
    error: string | undefined;
    success: boolean;
    hotel:hotel[];
    pendingRates:any[]
    
}
export interface hotel {
    hotelId: number;
    agencyId:number;
    hotelName: string;
    hotelAddress: string;
    hotelContactNo: string;
    hotelEmail: string;
    hotelRates : rates []
}

export interface rates {
    rateId: number;
    hotelId: number;
    rateType: string;
    rate: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
}