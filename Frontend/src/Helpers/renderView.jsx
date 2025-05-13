import React, { lazy, Suspense } from "react";
const Setting = lazy(() => import("@/components/Setting"));
const Calls = lazy(() => import("@/components/Calls"));
const renderView = (name) => {
    switch (name) {
        case 'settings':
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <Setting />
                </Suspense>
            )
        case 'calls':
            return(
                <Suspense fallback={<div>Loading...</div>}>
                    <Calls />
                </Suspense>
            )
        default:
            return null
    }
}
export default renderView;