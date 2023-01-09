import {createContext, ReactNode, useEffect, useState} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";

// Use context as follows:
// ThemeProvider > ThemeContext > themeContext > theme & setTheme

type ProviderProps = {
    children: ReactNode;
};

type Theme = {
    nightMode: boolean;
    prideMode?: boolean;
    milesMode: boolean;
    directionsMode: boolean;
};

type ThemeContextType = {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>> | null;
};

const initialTheme: Theme = {
    nightMode: false,
    milesMode: false,
    directionsMode: true,
};

const initialThemeContext: ThemeContextType = {
    theme: initialTheme,
    setTheme: null,
};

export const ThemeContext =
    createContext<ThemeContextType>(initialThemeContext);

export const ThemeProvider = ({children}: ProviderProps) => {
    const [storedTheme, storeTheme] = useLocalStorage<Theme>(
        "worldleTheme",
        initialTheme
    );

    const [theme, setTheme] = useState(storedTheme);

    useEffect(() => {
        storeTheme(theme);
    }, [storeTheme, theme]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
