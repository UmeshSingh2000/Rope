import React, { lazy, Suspense } from "react";
const Setting = lazy(() => import("@/components/Setting"));
const renderView = (name) => {
    switch (name) {
        case 'settings':
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <Setting />
                </Suspense>
            )
        default:
            return null
    }
}
export default renderView;