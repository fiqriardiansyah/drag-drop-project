import CardOperatorItem, { divideOperator, minusOperator, plusOperator, timesOperator } from "@/refactor/card/operator/item";
import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes } from "@/refactor/utils/constant";
import { AnimatePresence } from "framer-motion";
import React from "react";

const ListOperator = () => {
    const { menu, setMenu } = React.useContext(RefactorContext) as any;

    const dummyOperator = [
        {
            id: 1,
            text: 'Addition',
            icon: plusOperator.id,
            resolver: plusOperator.resolver
        },
        {
            id: 2,
            text: 'Substraction',
            icon: minusOperator.id,
            resolver: minusOperator.resolver
        },
        {
            id: 3,
            text: 'Multiplication',
            icon: timesOperator.id,
            resolver: timesOperator.resolver
        },
        {
            id: 4,
            text: 'Division',
            icon: divideOperator.id,
            resolver: divideOperator.resolver
        }
    ]

    if (menu !== MenuTypes.operator.id) return null
    return (
        <AnimatePresence>
            {menu === MenuTypes.operator.id ? (
                <div className="flex flex-col gap-5">
                    {dummyOperator.map((item) => (
                        <CardOperatorItem key={item.id} attach={{ data: item }}>
                            {item.text}
                        </CardOperatorItem>
                    ))}
                </div>
            ) : null}
        </AnimatePresence>
    )
}

export default ListOperator;