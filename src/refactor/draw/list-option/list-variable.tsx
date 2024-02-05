import CardVariableItem from "@/refactor/card/variable/item";
import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes, convertToStringFormat } from "@/refactor/utils/constant";
import { AnimatePresence } from "framer-motion";
import React from "react";

const ListVariable = () => {
    const { menu, setMenu } = React.useContext(RefactorContext) as any;

    const dummyVariables = [{
        id: 1,
        text: "Variable 1",
        price: 150000
    }, {
        id: 2,
        text: "Variable 2",
        price: 230000
    }, {
        id: 3,
        text: "Variable 3",
        price: 520000
    }]

    if (menu !== MenuTypes.variable.id) return null
    return (
        <AnimatePresence>
            {menu === MenuTypes.variable.id ? (
                <div className="flex flex-col gap-2">
                    {dummyVariables.map((item) => (
                        <CardVariableItem key={item.id} attach={{ data: item }}>
                            <div className="flex flex-col">
                                <span>{item.text}</span>
                                <span className="text-gray-600 text-xs font-medium">Rp. {convertToStringFormat(item.price)}</span>
                            </div>
                        </CardVariableItem>
                    ))}
                </div>
            ) : null}
        </AnimatePresence>
    )
}

export default ListVariable;