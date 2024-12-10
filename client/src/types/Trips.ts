export interface Trip {   
          
    startDate: Date;                    
    endDate: Date | null;               
    travelMode: string;                 
    startCity: number;                
    endCity: number;                                     
    stops: Stop[];                  
    userEmail: string;  
    title: string;   
    startWeather: WeatherDetails;
    endWeather: WeatherDetails;         
}
export interface Stop{
    cityName?: string;                  
    order: number;         
}

export interface WeatherDetails{            
    temperature?: number;                
    windSpeed?: number;                  
    description?: string;                                 
}
