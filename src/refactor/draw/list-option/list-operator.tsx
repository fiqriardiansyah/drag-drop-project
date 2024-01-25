import CardOperatorItem, { minusOperator, plusOperator, timesOperator } from "@/refactor/card/operator/item";
import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes } from "@/refactor/utils/constant";
import { AnimatePresence } from "framer-motion";
import React from "react";

const ListOperator = () => {
    const { menu, setMenu } = React.useContext(RefactorContext) as any;

    const dummyOperator = [
        {
            id: 1,
            text: 'Tambah',
            icon: plusOperator.id,
            resolver: plusOperator.resolver
        },
        {
            id: 2,
            text: 'Kurang',
            icon: minusOperator.id,
            resolver: minusOperator.resolver
        },
        {
            id: 3,
            text: 'Kali',
            icon: timesOperator.id,
            resolver: timesOperator.resolver
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