import { useState, useCallback, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export const VERIFIED_COOKIE_NAME = "is_verified";

function getCookieValue() {
    return Cookies.get(VERIFIED_COOKIE_NAME) === "true";
}

function subscribe(callback: () => void) {
    // Poll cookies every 500ms for changes (cookie doesn't emit events)
    const id = setInterval(callback, 500);
    return () => clearInterval(id);
}

export function useAccessControl() {
    const searchParams = useSearchParams();
    const isVerifiedFromCookie = useSyncExternalStore(subscribe, getCookieValue, () => false);

    const [isVerified, setIsVerified] = useState(isVerifiedFromCookie);
    const [showModal, setShowModal] = useState(() => {
        const ref = searchParams.get("ref");
        return !isVerifiedFromCookie && (ref === "linkedin" || ref === "recruiter");
    });

    const verify = useCallback(() => {
        Cookies.set(VERIFIED_COOKIE_NAME, "true", { expires: 7 });
        setIsVerified(true);
        setShowModal(false);
    }, []);

    return {
        isVerified,
        showModal,
        setShowModal,
        verify,
    };
}
