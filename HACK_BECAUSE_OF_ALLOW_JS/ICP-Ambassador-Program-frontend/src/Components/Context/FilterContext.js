import React, { createContext, useContext, useState } from 'react';
const FilterContext = createContext();
export const useFilterContext = () => {
    return useContext(FilterContext);
};
export const FilterProvider = ({ children }) => {
    const [selectedPlatform, setSelectedPlatform] = useState('');
    return (<FilterContext.Provider value={{ selectedPlatform, setSelectedPlatform }}>
      {children}
    </FilterContext.Provider>);
};
