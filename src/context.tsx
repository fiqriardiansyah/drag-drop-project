import React from "react";

const AppContext = React.createContext({});

const AppProvider = ({ children }: { children: any }) => {
    const [menu, setMenu] = React.useState("p");
    const [boxes, setBoxes] = React.useState<any[]>([])

    return (
        <AppContext.Provider value={{ menu, setMenu, boxes, setBoxes }}>
            {children}
        </AppContext.Provider>
    )
}

export {
    AppProvider,
    AppContext,
}