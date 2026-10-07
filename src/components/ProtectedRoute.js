import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RightsContext } from '../contexts/RightsProvider';

/**
 * Route-level companion to the sidebar's nav gating (SideBar.js) — a role
 * without the matching permission bit set is redirected to Profile instead
 * of being able to reach the page directly by typing the URL. Without
 * this, hiding a link from the sidebar was cosmetic only: nothing stopped
 * someone from navigating straight to /finance or /permissions anyway.
 *
 * Important: this is a UX / defense-in-depth layer on top of what the
 * backend enforces for *data* (every Program/Budget/Item/Account/Journal
 * Entry is now scoped to the caller's own Student/Alumni side, checked on
 * every request). It is NOT itself a security boundary for the separate
 * View/Edit/Add/Delete module permission bits (finance, budget_cost,
 * program, permission) — the backend API does not currently check those
 * bits on any of these endpoints, only IsAuthenticated. Someone who knows
 * the API could still call it directly regardless of what this component
 * shows or hides. Closing that gap needs the same kind of check added
 * server-side (mirroring how side-scoping was added), not just here.
 */
const ProtectedRoute = ({ requiredPerm }) => {
    const { rights } = useContext(RightsContext);
    const allowed = requiredPerm ? (rights?.perm?.[requiredPerm] > 0) : true;
    return allowed ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default ProtectedRoute;
