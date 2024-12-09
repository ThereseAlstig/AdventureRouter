interface Trip {
    id: number;                         
    startDate: Date;                     
    endDate: Date | null;                
    travelMode: string;                
    startCityId: number;               
    endCityId: number;                 
    createdAt: Date;                    
    stops: TripStop[];   
    userEmail: string;               
}

interface TripStop {
    id: number;                         
    tripId: number;                     
    cityId: number;                      
    stopOrder: number;                   
    weatherConditionId: number | null;   
    cityName?: string;                  
    weather?: WeatherCondition;         
}

interface WeatherCondition {
    id: number;                        
    weatherType: string;                
    temperature: number;                
    windSpeed: number;                 
    description: string;                
    createdAt: Date;                    
}