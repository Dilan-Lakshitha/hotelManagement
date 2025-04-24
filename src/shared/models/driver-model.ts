export interface driverModel {
    loading: boolean;
    error: string | undefined;
    success: boolean;
    driver:driver[];
}
export interface driver {
    driverId: number;
    agencyId:number;
    Name: string;
    vehicleType: string;
    vehiclePricePerKm: number;
}