import React, { useState } from "react";
 
export const DealsHereContext = React.createContext<any>({});
export const DealsHereContextProvider = ({ children }: any) => {
    const [location, setLocation] = useState(0);
    const [dealList, setDealList] = useState([] as any[]);
 
    return (
        <DealsHereContext.Provider value={{ location, setLocation, dealList, setDealList }}>
            {children}
        </DealsHereContext.Provider>
    )
}