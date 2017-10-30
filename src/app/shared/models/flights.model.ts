export interface flightDetails {
  departures: string[];
  from: string;
  returns: string[];
  to: string;
  type: string;
}


export interface SearchResult {
  all_airlines: string[];
  all_stopover_airports: string[];
  connections: string[];
  currency: string;
  currency_rate: number;
  data: any[];
  del: number;
  ref_tasks: any;
  refresh: any[];
  search_params: {
    flyFrom_type: string,
    to_type: string,
    seats: {
      infants: number,
      passengers: number,
      adults: number,
      children: number
    }
  };
  time: number;
  _results: number
}

export interface GoogleFlightPath {
  "_.Mg": {
    gm_accessors_: any;
    gm_bindings_: any;
    latLngs:any;
    map: any;
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    visible: boolean;
    geodesic: boolean
  }
}