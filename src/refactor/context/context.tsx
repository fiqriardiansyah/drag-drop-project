import React from "react";
import { MenuTypes } from "../utils/constant";

const RefactorContext = React.createContext({});

const RefactorProvider = ({ children }: { children: any }) => {
    const [menu, setMenu] = React.useState(MenuTypes.operator.id);
    const [entities, setEntities] = React.useState<any[]>([]);
    const [activeDropContainer, setActiveDropContainer] = React.useState();

    return (
        <RefactorContext.Provider value={{ menu, setMenu, entities, setEntities, activeDropContainer, setActiveDropContainer }}>
            {children}
        </RefactorContext.Provider>
    )
}

export {
    RefactorContext, RefactorProvider
};
