export interface itineraryModel {
    loading: boolean;
    error: string | undefined;
    success: boolean;
    itinerary: itinerary[];
}
export interface itinerary {
    itinerary_id: number;
    start_date: Date;
    end_date: Date;
    dailyPlans: dailyPlan[];
}

export interface dailyPlan {
    day_number: number;
    date: Date;
    location: string;
    activities: string;
    hotel_id: string;
    location_ticket_id: string;
}